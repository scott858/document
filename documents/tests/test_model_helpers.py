from documents import models
from django.contrib.auth.models import User


def create_old_revision(revision_id):
    document = models.NsDocument.objects.create()
    project = models.NsProject.objects.create(name=str(revision_id))
    revision = revision_id
    created_by = User.objects.create(username=revision_id)
    document_type = models.NsDocumentType.objects.create(name=str(revision_id),
                                                         code=str(revision_id))
    document_format = models.NsDocumentFormat.objects.create(name=str(revision_id),
                                                             file_extension=str(revision_id))

    return models.NsDocumentOldRevision.objects.create(
        document=document,
        revision=revision,
        created_by=created_by,
        project=project,
        document_type=document_type,
        concise_description=str(revision_id),
        verbose_description=str(revision_id),
        document_format=document_format,
        filename=str(revision_id),
        filepath='/'
    )


def create_revision(revision_id):
    document = models.NsDocument.objects.create()
    project = models.NsProject.objects.create(name=str(revision_id))
    revision = revision_id
    created_by = User.objects.create(username=revision_id)
    document_type = models.NsDocumentType.objects.create(name=str(revision_id),
                                                         code=str(revision_id))
    document_format = models.NsDocumentFormat.objects.create(name=str(revision_id),
                                                             file_extension=str(revision_id))

    return models.NsDocumentRevision.objects.create(
        document=document,
        revision=revision,
        created_by=created_by,
        project=project,
        document_type=document_type,
        concise_description=str(revision_id),
        verbose_description=str(revision_id),
        document_format=document_format,
        filename=str(revision_id),
        filepath='/'
    )
