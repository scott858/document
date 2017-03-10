from django.db import models
from django.contrib.auth.models import User
from django_extensions.db.models import TimeStampedModel
import datetime


class NsDocument(TimeStampedModel):
    def __str__(self):
        return str(self.revisions.order_by('-id').first())


class NsDocumentRevision(TimeStampedModel):
    DOCUMENT_REVISION_LENGTH = 3
    DOCUMENT_NUMBER_LENGTH = 7
    DEFAULT_FILE_PATH = '//Nucleus-NAS1/Nucleus/PROJECTS/'

    document = models.ForeignKey('NsDocument', related_name='revisions')
    revision = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(User)

    project = models.ForeignKey('NsProject')
    document_type = models.ForeignKey('NsDocumentType')
    concise_description = models.CharField(max_length=63)
    verbose_description = models.TextField(blank=True, default="")
    document_format = models.ForeignKey('NsDocumentFormat')
    filename = models.CharField(max_length=255, blank=True, unique=True)
    filepath = models.FilePathField(match='//Nucleus-NAS1/Nucleus/PROJECTS/*', unique=True)

    def format_document_number(self):
        try:
            document_number = str(self.document.id + 1000000)
            padding_length = self.DOCUMENT_NUMBER_LENGTH - len(document_number)
            if padding_length > 0:
                padding = '0' * padding_length
                document_number = padding + document_number
        except Exception as e:
            document_number = '0'
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

    def __str__(self):
        project_code = str(self.project.format_project_code())

        document_type_code = str(self.document_type.format_document_code())

        document_number = self.format_document_number()
        revision = self.format_revision_number()

        concise_description = self.concise_description.title()
        concise_description = concise_description.replace(" ", "")

        file_ext = self.document_format.file_extension

        date = datetime.datetime.now().strftime("%Y%m%d")

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

    project = models.ForeignKey('NsProject')
    document_type = models.ForeignKey('NsDocumentType')
    concise_description = models.CharField(max_length=63)
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
    EPDM_TYPE = '001'
    ELE_TYPE = '002'
    SOP_TYPE = '003'
    RQM_TYPE = '004'
    RPT_TYPE = '005'
    DOCUMENT_TYPE_CHOICES = (
        (EPDM_TYPE, 'EPDM file'),
        (ELE_TYPE, 'electrical file'),
        (SOP_TYPE, 'standard operation procedure file'),
        (RQM_TYPE, 'requirement file or template'),
        (RPT_TYPE, 'report'),
    )

    name = models.CharField(max_length=63, unique=True)
    code = models.CharField(max_length=3, unique=True)

    def format_document_code(self):
        document_code = str(self.code)
        padding_length = self.DOCUMENT_TYPE_LENGTH - len(document_code)
        if padding_length > 0:
            padding = '0' * padding_length
            document_code = padding + document_code
        return document_code

    def __str__(self):
        return self.name


class NsDocumentFormat(TimeStampedModel):
    PLAIN_TEXT_EXTENSION = '.txt'
    HTML_EXTENSION = '.html'
    MS_WORD_EXTENSION = '.doc'
    MS_EXCEL_EXTENSION = '.xlsx'

    FILE_FORMAT_CHOICES = (
        (PLAIN_TEXT_EXTENSION, 'plain text'),
        (HTML_EXTENSION, 'HTML'),
        (MS_WORD_EXTENSION, 'MS Word'),
        (MS_EXCEL_EXTENSION, 'MS Excel'),
    )

    name = models.CharField(max_length=31, unique=True)
    file_extension = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.name


class NsProject(TimeStampedModel):
    PROJECT_CODE_LENGTH = 5
    name = models.CharField(max_length=63, unique=True)

    def format_project_code(self):
        project_code = str(self.id)
        padding_length = self.PROJECT_CODE_LENGTH - len(project_code)
        if padding_length > 0:
            padding = '0' * padding_length
            project_code = padding + project_code
        return project_code

    def __str__(self):
        return self.name
