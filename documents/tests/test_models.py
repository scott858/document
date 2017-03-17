from django.test import TestCase
from django.db import transaction
from django.db.utils import IntegrityError
from django.contrib.auth.models import User

from logging import getLogger
from documents import models
from . import test_model_helpers

logger = getLogger(__name__)


class NsDocumentTestCase(TestCase):
    def setUp(self):
        models.NsDocument.objects.create()

    def test_document_created(self):
        documents = models.NsDocument.objects.all()
        self.assertGreater(documents.count(), 0)


class NsProjectTestCase(TestCase):
    def setUp(self):
        models.NsProject.objects.create()

    def tearDown(self):
        models.NsProject.objects.all().delete()

    def test_project_created(self):
        projects = models.NsProject.objects.all()
        self.assertGreater(projects.count(), 0)

    def test_project_code_is_correct_length(self):
        project = models.NsProject.objects.first()
        formatted_project_code = project.format_code()
        self.assertNotEqual(len(formatted_project_code), 0)
        self.assertEqual(len(formatted_project_code), models.NsProject.PROJECT_CODE_LENGTH)

    def test_project_code_is_correct_type(self):
        project = models.NsProject.objects.first()
        formatted_project_code = project.format_code()
        self.assertIsInstance(formatted_project_code, str)

    @transaction.atomic
    def test_project_code_is_padded_with_zeros(self):
        for i in range(20):
            project = models.NsProject.objects.create(name=str(i))
            project_id_string = str(project.id)
            id_length = len(project_id_string)
            zeros_in_project_id = project_id_string.count('0')
            formatted_project_code = project.format_code()
            expected_padding_size = models.NsProject.PROJECT_CODE_LENGTH - id_length
            actual_padding_size = formatted_project_code.count('0') - zeros_in_project_id
            self.assertEqual(expected_padding_size, actual_padding_size)
            self.assertEqual(id_length, models.NsProject.PROJECT_CODE_LENGTH - actual_padding_size)
            self.assertEqual(formatted_project_code.find('0' * expected_padding_size), 0)
            self.assertEqual(
                formatted_project_code.find('0' * (expected_padding_size + 1), 0, expected_padding_size + 1),
                -1
            )

    @transaction.atomic
    def test_name_is_unique(self):
        try:
            models.NsProject.objects.create(name='samename')
            models.NsProject.objects.create(name='samename')
            self.fail("Creating two projects formats of same name should fail!")
        except IntegrityError as e:
            pass

    def test_str(self):
        project = models.NsProject.objects.first()
        self.assertEqual(project.name + '_' + project.format_code(), str(project))


class NsDocumentFormatTestCase(TestCase):
    def setUp(self):
        models.NsDocumentFormat.objects.create()

    def tearDown(self):
        models.NsDocumentFormat.objects.all().delete()

    def test_document_format_created(self):
        formats = models.NsDocumentFormat.objects.all()
        self.assertGreater(formats.count(), 0)

    @transaction.atomic
    def test_name_is_unique(self):
        try:
            models.NsDocumentFormat.objects.create(name='samename')
            models.NsDocumentFormat.objects.create(name='samename')
            self.fail("Creating two document formats of same name should fail!")
        except IntegrityError as e:
            pass

    @transaction.atomic
    def test_file_extension_is_unique(self):
        try:
            models.NsDocumentFormat.objects.create(file_extension='samename')
            models.NsDocumentFormat.objects.create(file_extension='samename')
            self.fail("Creating two document formats of same extension should fail!")
        except IntegrityError as e:
            pass

    def test_str(self):
        document_format = models.NsDocumentFormat.objects.first()
        self.assertEqual(document_format.name + '_' + document_format.file_extension
                         , str(document_format))


class NsDocumentTypeTestCase(TestCase):
    def setUp(self):
        models.NsDocumentType.objects.create()

    def tearDown(self):
        models.NsDocumentType.objects.all().delete()

    def test_document_format_created(self):
        types = models.NsDocumentType.objects.all()
        self.assertGreater(types.count(), 0)

    @transaction.atomic
    def test_name_is_unique(self):
        try:
            models.NsDocumentType.objects.create(name='samename')
            models.NsDocumentType.objects.create(name='samename')
            self.fail("Creating two document types of same name should fail!")
        except IntegrityError as e:
            pass

    @transaction.atomic
    def test_file_extension_is_unique(self):
        try:
            models.NsDocumentType.objects.create(code='sam')
            models.NsDocumentType.objects.create(code='sam')
            self.fail("Creating two document types of same code should fail!")
        except IntegrityError as e:
            pass

    def test_str(self):
        document_type = models.NsDocumentType.objects.first()
        self.assertEqual(document_type.name + '_' + document_type.format_code(),
                         str(document_type))

    def test_document_type_code_is_correct_length(self):
        document_type = models.NsDocumentType.objects.first()
        formatted_document_type_code = document_type.format_code()
        self.assertNotEqual(len(formatted_document_type_code), 0)
        self.assertEqual(len(formatted_document_type_code), models.NsDocumentType.DOCUMENT_TYPE_LENGTH)

    def test_document_type_code_is_correct_type(self):
        document_type = models.NsDocumentType.objects.first()
        formatted_document_type_code = document_type.format_code()
        self.assertIsInstance(formatted_document_type_code, str)

    @transaction.atomic
    def test_document_type_code_is_padded_with_zeros(self):
        # breaks if i starts at 0
        for i in range(1, 20):
            document_type = models.NsDocumentType.objects.create(code=str(i),
                                                                 name=i)
            code_length = len(document_type.code)
            zeros_in_document_type_code = document_type.code.count('0')
            formatted_document_type_code = document_type.format_code()
            expected_padding_size = models.NsDocumentType.DOCUMENT_TYPE_LENGTH - code_length
            actual_padding_size = formatted_document_type_code.count('0') - zeros_in_document_type_code
            self.assertEqual(expected_padding_size, actual_padding_size)
            self.assertEqual(code_length, models.NsDocumentType.DOCUMENT_TYPE_LENGTH - actual_padding_size)
            self.assertEqual(formatted_document_type_code.find('0' * expected_padding_size), 0)
            self.assertEqual(
                formatted_document_type_code.find('0' * (expected_padding_size + 1), 0, expected_padding_size + 1),
                -1
            )


class NsDocumentOldRevisionTestCase(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_create_basic(self):
        document = models.NsDocument.objects.create()
        project = models.NsProject.objects.create()
        created_by = User.objects.create(username='test')
        document_type = models.NsDocumentType.objects.create()
        document_format = models.NsDocumentFormat.objects.create()

        old_revision_count_before = models.NsDocumentOldRevision.objects.all().count()
        models.NsDocumentOldRevision.objects.create(
            document=document,
            revision=1,
            created_by=created_by,
            project=project,
            document_type=document_type,
            concise_description="concise",
            verbose_description='verbose',
            document_format=document_format,
            filename='filename',
            filepath='/'
        )
        old_revision_count_after = models.NsDocumentOldRevision.objects.all().count()
        self.assertGreater(old_revision_count_after, old_revision_count_before)

    def test_unique_document_and_revision(self):
        document = models.NsDocument.objects.create()
        project = models.NsProject.objects.create(name='1')
        revision = 1
        created_by = User.objects.create(username='test')
        document_type = models.NsDocumentType.objects.create(name='1',
                                                             code='1')
        document_format = models.NsDocumentFormat.objects.create(name='1',
                                                                 file_extension='1')

        old_revision_count_before = models.NsDocumentOldRevision.objects.all().count()
        models.NsDocumentOldRevision.objects.create(
            document=document,
            revision=revision,
            created_by=created_by,
            project=project,
            document_type=document_type,
            concise_description="concise",
            verbose_description='verbose',
            document_format=document_format,
            filename='filename',
            filepath='/'
        )
        old_revision_count_after = models.NsDocumentOldRevision.objects.all().count()
        self.assertGreater(old_revision_count_after, old_revision_count_before)

        try:
            project = models.NsProject.objects.create(name='2')
            document_type = models.NsDocumentType.objects.create(name='2',
                                                                 code='2')
            document_format = models.NsDocumentFormat.objects.create(name='2',
                                                                     file_extension='2')

            models.NsDocumentOldRevision.objects.create(
                document=document,
                revision=1,
                project=project,
                created_by=created_by,
                document_type=document_type,
                concise_description="concise2",
                verbose_description='verbose2',
                document_format=document_format,
                filename='filename2',
                filepath='/2'
            )
            self.fail('creating an old revision with the same document and revision should fail')
        except IntegrityError as e:
            pass

    @transaction.atomic
    def test_filename_is_unique(self):
        try:
            models.NsDocumentOldRevision.objects.create(filename='samename')
            models.NsDocumentOldRevision.objects.create(filename='samename')
            self.fail("Creating two old revisions of same filename should fail!")
        except IntegrityError as e:
            pass

    @transaction.atomic
    def test_filepath_is_unique(self):
        try:
            models.NsDocumentOldRevision.objects.create(filepath='samename')
            models.NsDocumentOldRevision.objects.create(filepath='samename')
            self.fail("Creating two old revisions of same filepath should fail!")
        except IntegrityError as e:
            pass


class NsDocumentRevisionTestCase(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_create_basic(self):
        document = models.NsDocument.objects.create()
        revision = 1
        created_by = User.objects.create(username='test')
        project = models.NsProject.objects.create()
        document_type = models.NsDocumentType.objects.create()
        document_format = models.NsDocumentFormat.objects.create()

        revision_count_before = models.NsDocumentRevision.objects.all().count()
        models.NsDocumentRevision.objects.create(
            document=document,
            revision=revision,
            created_by=created_by,
            project=project,
            document_type=document_type,
            concise_description="concise",
            verbose_description='verbose',
            document_format=document_format,
            filename='filename',
            filepath='/'
        )
        revision_count_after = models.NsDocumentRevision.objects.all().count()
        self.assertGreater(revision_count_after, revision_count_before)

    def test_unique_document_and_revision(self):
        document = models.NsDocument.objects.create()
        revision = 1
        project = models.NsProject.objects.create(name='1')
        created_by = User.objects.create(username='test')
        document_type = models.NsDocumentType.objects.create(name='1',
                                                             code='1')
        document_format = models.NsDocumentFormat.objects.create(name='1',
                                                                 file_extension='1')

        old_revision_count_before = models.NsDocumentRevision.objects.all().count()
        models.NsDocumentRevision.objects.create(
            document=document,
            revision=revision,
            created_by=created_by,
            project=project,
            document_type=document_type,
            concise_description="concise",
            verbose_description='verbose',
            document_format=document_format,
            filename='filename',
            filepath='/'
        )
        old_revision_count_after = models.NsDocumentRevision.objects.all().count()
        self.assertGreater(old_revision_count_after, old_revision_count_before)

        try:
            project = models.NsProject.objects.create(name='2')
            document_type = models.NsDocumentType.objects.create(name='2',
                                                                 code='2')
            document_format = models.NsDocumentFormat.objects.create(name='2',
                                                                     file_extension='2')

            models.NsDocumentRevision.objects.create(
                document=document,
                revision=revision,
                created_by=created_by,
                project=project,
                document_type=document_type,
                concise_description="concise2",
                verbose_description='verbose2',
                document_format=document_format,
                filename='filename2',
                filepath='/2'
            )
            self.fail('creating an old revision with the same document and revision should fail')
        except IntegrityError as e:
            pass

    def test_str(self):
        # TODO
        pass

    @transaction.atomic
    def test_document_number_is_added_to_1_million(self):
        for i in range(20):
            revision = test_model_helpers.create_revision(i)
            formatted_document_number = revision.format_document_number()
            self.assertEqual(int(formatted_document_number),
                             models.NsDocumentRevision.DOCUMENT_NUMBER_BASE + revision.document.id)

    def test_formatted_revision_number_is_correct_length(self):
        revision = test_model_helpers.create_revision(1)
        formatted_revision = revision.format_revision_number()
        self.assertNotEqual(len(formatted_revision), 0)
        self.assertEqual(len(formatted_revision), models.NsDocumentRevision.DOCUMENT_REVISION_LENGTH)

    def test_formatted_revision_is_correct_type(self):
        revision = test_model_helpers.create_revision(1)
        formatted_revision = revision.format_revision_number()
        self.assertIsInstance(formatted_revision, str)

    @transaction.atomic
    def test_formatted_revision_is_padded_with_zeros(self):
        # breaks if i starts at 0
        for i in range(1, 20):
            revision = test_model_helpers.create_revision(i)
            revision_id_length = len(str(revision.revision))
            zeros_in_revision_id = str(revision.revision).count('0')
            formatted_revision = revision.format_revision_number()
            expected_padding_size = models.NsDocumentRevision.DOCUMENT_REVISION_LENGTH - revision_id_length
            actual_padding_size = formatted_revision.count('0') - zeros_in_revision_id
            self.assertEqual(expected_padding_size, actual_padding_size)
            self.assertEqual(revision_id_length,
                             models.NsDocumentRevision.DOCUMENT_REVISION_LENGTH - actual_padding_size)
            self.assertEqual(formatted_revision.find('0' * expected_padding_size), 0)
            self.assertEqual(
                formatted_revision.find('0' * (expected_padding_size + 1), 0, expected_padding_size + 1),
                -1
            )

    def test_format_concise_description_drops_special_characters_and_snakes(self):
        revision = test_model_helpers.create_revision(1)
        revision.concise_description = """!@#$%^&*()_+-=,./<>?;':"[]{}\|"""
        self.assertEqual(len(revision.format_concise_description()), 0)

        revision.concise_description = """abc !@#$%^&*()_+-=,./<>?;':"[]{}\| 123 dsa"""
        self.assertEqual(revision.format_concise_description(), 'Abc123Dsa')

    def test_format_concise_description_truncates_verbose_descriptions(self):
        revision = test_model_helpers.create_revision(1)
        revision.concise_description = '3' * 100
        self.assertEqual(len(revision.format_concise_description()), revision.CONCISE_DESCRIPTION_MAX_LENGTH)

    def test_file_name_creation(self):
        revision_id = 123

        document = models.NsDocument.objects.get_or_create(pk=revision_id)[0]
        project = models.NsProject.objects.get_or_create(pk=revision_id)[0]
        revision = revision_id
        created_by = User.objects.get_or_create(username=revision_id)[0]
        document_type = models.NsDocumentType.objects.get_or_create(name=str(revision_id),
                                                                    code=str(revision_id))[0]
        document_format = models.NsDocumentFormat.objects.get_or_create(name=str(revision_id),
                                                                        file_extension=str(revision_id))[0]

        concise_description = """!@#$%^&*( abc ..?><> 123 heLLo"""
        revision = models.NsDocumentRevision.objects.create(
            document=document,
            revision=revision,
            created_by=created_by,
            project=project,
            document_type=document_type,
            concise_description=concise_description,
            verbose_description=str(revision_id),
            document_format=document_format,
            filename=str(revision_id),
            filepath='/'
        )

        expected_filename_before_date = '00123_123_1000123'
        self.assertEqual(revision.filename[:len(expected_filename_before_date)], expected_filename_before_date)

        expected_filename_after_date = '_V123_Abc123Hello.123'
        self.assertEqual(revision.filename[-(len(expected_filename_after_date)):], expected_filename_after_date)
