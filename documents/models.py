from django.db import models
from django.contrib.auth.models import User
from django_extensions.db.models import TimeStampedModel
import datetime


class NsDocument(TimeStampedModel):
    def __str__(self):
        return str(self.revisions.order_by('-id').first())


class NsDocumentRevision(TimeStampedModel):
    CONCISE_DESCRIPTION_MAX_LENGTH = 32
    DOCUMENT_REVISION_LENGTH = 3
    DOCUMENT_NUMBER_BASE = 1000000
    DEFAULT_FILE_PATH = '//Nucleus-NAS1/Nucleus/PROJECTS/'

    document = models.ForeignKey('NsDocument', related_name='revisions')
    revision = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(User)

    project = models.ForeignKey('NsProject')
    document_type = models.ForeignKey('NsDocumentType')
    concise_description = models.CharField(max_length=64)
    verbose_description = models.TextField(blank=True, default="")
    document_format = models.ForeignKey('NsDocumentFormat')
    filename = models.CharField(max_length=255, blank=True, unique=True)
    filepath = models.FilePathField(match='//Nucleus-NAS1/Nucleus/PROJECTS/*', unique=True)

    def format_document_number(self):
        document_number = str(self.document.id + self.DOCUMENT_NUMBER_BASE)
        return document_number

    def format_revision_number(self):
        try:
            revision_number = str(self.revision)
            padding_length = self.DOCUMENT_REVISION_LENGTH - len(revision_number)
            if padding_length > 0:
                padding = '0' * padding_length
                revision_number = padding + revision_number
        except Exception as e:
            revision_number = '0'
        return revision_number

    def format_concise_description(self):
        self.concise_description = self.concise_description.title()
        self.concise_description = ''.join(
            e for e in self.concise_description if e.isalnum()
        )
        if len(self.concise_description) > self.CONCISE_DESCRIPTION_MAX_LENGTH:
            self.concise_description = self.concise_description[:self.CONCISE_DESCRIPTION_MAX_LENGTH]
        return self.concise_description

    def __str__(self):
        project_code = str(self.project.format_code())

        document_type_code = str(self.document_type.format_code())

        document_number = self.format_document_number()

        date = datetime.datetime.now().strftime("%Y%m%d")

        revision = self.format_revision_number()

        concise_description = self.format_concise_description()

        file_ext = self.document_format.file_extension

        return project_code + "_" + \
               document_type_code + "_" + \
               document_number + "_" + \
               date + "_" + "V" + \
               revision + "_" + \
               concise_description + \
               '.' + file_ext

    def save(self, **kwargs):
        self.filename = self.__str__()
        self.filepath = self.DEFAULT_FILE_PATH + self.filename
        super().save(**kwargs)

    class Meta:
        unique_together = ('document', 'revision')


class NsDocumentOldRevision(TimeStampedModel):
    document = models.ForeignKey('NsDocument', related_name='old_revisions')
    revision = models.PositiveIntegerField()
    created_by = models.ForeignKey(User)

    project = models.ForeignKey('NsProject')
    document_type = models.ForeignKey('NsDocumentType')
    concise_description = models.CharField(max_length=64)
    verbose_description = models.TextField(blank=True, default="")
    document_format = models.ForeignKey('NsDocumentFormat')
    filename = models.CharField(max_length=255, blank=True, unique=True)
    filepath = models.FilePathField(match='//Nucleus-NAS1/Nucleus/PROJECTS/*', unique=True)

    def __str__(self):
        return self.filename

    class Meta:
        unique_together = ('document', 'revision')


class NsDocumentType(TimeStampedModel):
    DOCUMENT_TYPE_LENGTH = 3
    name = models.CharField(max_length=63, unique=True)
    code = models.CharField(max_length=3, unique=True)

    def format_code(self):
        document_code = str(self.code)
        padding_length = self.DOCUMENT_TYPE_LENGTH - len(document_code)
        if padding_length > 0:
            padding = '0' * padding_length
            document_code = padding + document_code
        return document_code

    def __str__(self):
        return self.name


class NsDocumentFormat(TimeStampedModel):
    name = models.CharField(max_length=32, unique=True)
    file_extension = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.name


class NsProject(TimeStampedModel):
    PROJECT_CODE_LENGTH = 5
    name = models.CharField(max_length=64, unique=True)

    def format_code(self):
        project_code = str(self.id)
        padding_length = self.PROJECT_CODE_LENGTH - len(project_code)
        if padding_length > 0:
            padding = '0' * padding_length
            project_code = padding + project_code
        return project_code

    def __str__(self):
        return self.name
