import django_filters
from rest_framework import generics, filters
from rest_framework.response import Response
import documents.models
from . import serializers


class NsDocumentRevisionFilter(filters.FilterSet):
    id = django_filters.CharFilter(name='id', lookup_expr='icontains')
    project__name = django_filters.CharFilter(name='project__name', lookup_expr='icontains')

    document__id = django_filters.CharFilter(name='document__id', lookup_expr='icontains')
    document_type__name = django_filters.CharFilter(name='document_type__name', lookup_expr='icontains')

    document_format__name = django_filters.CharFilter(name='document_format__name', lookup_expr='icontains')
    filename = django_filters.CharFilter(name='filename', lookup_expr='icontains')

    concise_description = django_filters.CharFilter(name='concise_description', lookup_expr='icontains')
    verbose_description = django_filters.CharFilter(name='verbose_description', lookup_expr='icontains')

    revision = django_filters.CharFilter(name='revision', lookup_expr='icontains')

    created_by__username = django_filters.CharFilter(name='created_by__username', lookup_expr='icontains')

    class Meta:
        model = documents.models.NsDocumentRevision
        fields = ('id', 'project__name',
                  'document_type__name', 'document__id',
                  'concise_description', 'verbose_description',
                  'document_format__name', 'filename', 'filepath',
                  'revision', 'created_by__username')


class NsDocumentRevisionListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows document metadata to be edited.
    """
    queryset = documents.models.NsDocumentRevision.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentRevisionUpdateSerializer

    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.OrderingFilter)

    filter_class = NsDocumentRevisionFilter
    ordering_fields = '__all__'


class NsDocumentRevisionReadOnlyListView(generics.ListCreateAPIView):
    """
    API endpoint allows document metadata to be edited.
    """
    queryset = documents.models.NsDocumentRevision.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentRevisionReadOnlySerializer

    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.OrderingFilter)

    filter_class = NsDocumentRevisionFilter
    ordering_fields = '__all__'


class NsDocumentListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows document metadata to be edited.
    """
    queryset = documents.models.NsDocument.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentReadOnlySerializer


class NsDocumentListReadOnlyView(generics.ListCreateAPIView):
    """
    API endpoint allows document metadata to be edited.
    """
    queryset = documents.models.NsDocument.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentReadOnlySerializer

    def post(self, request, *args, **kwargs):
        new_revision = documents.models.NsDocumentRevision()

        try:
            new_revision.concise_description = request.data['concise_description']
        except Exception as e:
            pass

        try:
            new_revision.document_format_id = request.data['document_format']
        except Exception as e:
            pass

        try:
            new_revision.document_type_id = request.data['document_type']
        except Exception as e:
            pass

        try:
            new_revision.project_id = request.data['project']
        except Exception as e:
            pass

        try:
            new_revision.verbose_description = request.data['verbose_description']
        except Exception as e:
            pass

        try:
            existing_document_id = request.data['document_id']
        except Exception as e:
            existing_document_id = None

        new_revision.created_by = request.user

        document = documents.models.NsDocument.objects.get_or_create(pk=existing_document_id)[0]
        latest_revision = 0
        if existing_document_id is not None:
            old_revisions = document.revisions.all()
            for revision in old_revisions:
                if revision.revision > latest_revision:
                    latest_revision = revision.revision
                documents.models.NsDocumentOldRevision.objects.create(
                    document=revision.document,
                    revision=revision.revision,
                    created_by=revision.created_by,
                    project=revision.project,
                    document_type=revision.document_type,
                    concise_description=revision.concise_description,
                    verbose_description=revision.verbose_description,
                    document_format=revision.document_format,
                    filename=revision.filename,
                    filepath=revision.filepath,
                )
                revision.delete()
        document.save()
        new_revision.document = document
        new_revision.revision = latest_revision + 1
        new_revision.save()
        return Response('OK')


class NsDocumentTypeListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows document types to be edited.
    """
    queryset = documents.models.NsDocumentType.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentTypeSerializer


class NsDocumentFormatListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows document types to be edited.
    """
    queryset = documents.models.NsDocumentFormat.objects.all().order_by("-id")
    serializer_class = serializers.NsDocumentFormatSerializer


class NsProjectListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows projects to be edited.
    """
    queryset = documents.models.NsProject.objects.all().order_by('-id')
    serializer_class = serializers.NsProjectSerializer
