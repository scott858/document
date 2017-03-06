from rest_framework import permissions
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
import django_filters
from rest_framework import viewsets, generics, filters
import documents.models
from . import serializers


class NsDocumentFilter(filters.FilterSet):
    id = django_filters.CharFilter(name='id', lookup_expr='icontains')
    project__name = django_filters.CharFilter(name='project__name', lookup_expr='icontains')
    document_type__name = django_filters.CharFilter(name='document_type__name', lookup_expr='icontains')
    part__name = django_filters.CharFilter(name='part__name', lookup_expr='icontains')
    major_version = django_filters.CharFilter(name='major_version', lookup_expr='icontains')
    minor_version = django_filters.CharFilter(name='minor_version', lookup_expr='icontains')
    document_format__name = django_filters.CharFilter(name='document_format__name', lookup_expr='icontains')
    filename = django_filters.CharFilter(name='filename', lookup_expr='icontains')

    class Meta:
        model = documents.models.NsDocument
        fields = ('id', 'project__name',
                  'document_type__name', 'part__name',
                  'concise_description', 'verbose_description',
                  'major_version', 'minor_version',
                  'document_format__name', 'filename', 'filepath')


class NsDocumentListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows document metadata to be edited.
    """
    queryset = documents.models.NsDocument.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentUpdateSerializer

    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.OrderingFilter)

    filter_class = NsDocumentFilter
    ordering_fields = '__all__'


class NsDocumentListReadOnlyView(generics.ListCreateAPIView):
    """
    API endpoint allows document metadata to be edited.
    """
    queryset = documents.models.NsDocument.objects.all().order_by('-id')
    serializer_class = serializers.NsDocumentReadOnlySerializer

    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.OrderingFilter)

    filter_class = NsDocumentFilter
    ordering_fields = '__all__'


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


class NsPartListCreateView(generics.ListCreateAPIView):
    """
    API endpoint allows parts to be edited.
    """
    queryset = documents.models.NsPart.objects.all().order_by('-id')
    serializer_class = serializers.NsPartSerializer
