from django.db import models
from django_extensions.db.models import TimeStampedModel
import datetime


class NsDocument(TimeStampedModel):
    DEFAULT_FILE_PATH = '//Nucleus-NAS1/Nucleus/PROJECTS/'

    project = models.ForeignKey('NsProject')
    document_type = models.ForeignKey('NsDocumentType')
    part = models.ForeignKey('NsPart')
    concise_description = models.CharField(max_length=63)
    verbose_description = models.TextField(blank=True, default="")
    major_version = models.CharField(max_length=1)
    minor_version = models.CharField(max_length=1)
    document_format = models.ForeignKey('NsDocumentFormat')
    filename = models.CharField(max_length=255, blank=True, unique=True)
    filepath = models.FilePathField(match='//Nucleus-NAS1/Nucleus/PROJECTS/*', unique=True)

    def __str__(self):
        project_code = str(self.project.format_project_code())

        document_type_code = str(self.document_type.format_document_code())

        part = str(self.part.format_part_number())

        concise_description = self.concise_description.title()
        concise_description = concise_description.replace(" ", "")

        version = str(self.major_version) + str(self.minor_version)

        file_ext = self.document_format.file_extension

        date = datetime.datetime.now().strftime("%Y%m%d")

        return project_code + "_" + \
               document_type_code + "_" + \
               part + "_" + \
               date + "_" + \
               concise_description + "_V" + \
               version + \
               '.' + file_ext

    def save(self, **kwargs):
        self.filename = self.__str__()
        self.filepath = self.DEFAULT_FILE_PATH + self.filename
        super().save(**kwargs)


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


class NsPart(TimeStampedModel):
    PART_NUMBER_LENGTH = 7
    name = models.CharField(max_length=63, unique=True)
    number = models.IntegerField(unique=True)

    def format_part_number(self):
        part_number = str(self.number)
        padding_length = self.PART_NUMBER_LENGTH - len(part_number)
        if padding_length > 0:
            padding = '0' * padding_length
            part_number = padding + part_number
        return part_number

    def __str__(self):
        return self.format_part_number() + "_" + self.name
