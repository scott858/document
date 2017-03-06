import documents.models
from rest_framework import serializers


class NsProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsProject
        fields = ('id', 'name')


class NsPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsPart
        fields = ('id', 'name', 'number')


class NsDocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsDocumentType
        fields = ('id', 'name', 'code')


class NsDocumentFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsDocumentFormat
        fields = ('name', 'file_extension')


class NsDocumentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsDocument
        fields = ('id', 'project', 'document_type', 'part',
                  'concise_description', 'verbose_description',
                  'major_version', 'minor_version',
                  'document_format', 'filename', 'filepath')
        read_only_fields = ('filename', 'filepath')


class NsDocumentReadOnlySerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField()
    document_type = serializers.StringRelatedField()
    part = serializers.StringRelatedField()
    document_format = serializers.StringRelatedField()

    class Meta:
        model = documents.models.NsDocument
        fields = ('id', 'project', 'document_type', 'part',
                  'concise_description', 'verbose_description',
                  'major_version', 'minor_version',
                  'document_format', 'filename', 'filepath')
        read_only_fields = ('filename', 'filepath')
