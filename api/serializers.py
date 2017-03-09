import documents.models
from rest_framework import serializers


class NsProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsProject
        fields = ('id', 'name')


class NsDocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsDocumentType
        fields = ('id', 'name', 'code')


class NsDocumentFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsDocumentFormat
        fields = ('id', 'name', 'file_extension')


class NsDocumentReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('created', 'modified', '__str__',)
        model = documents.models.NsDocument
        read_only_fields = ('created', 'modified', '__str__')


class NsDocumentRevisionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = documents.models.NsDocumentRevision
        fields = ('id', 'project', 'document', 'document_type',
                  'concise_description', 'verbose_description',
                  'document_format', 'filename', 'filepath')
        read_only_fields = ('filename', 'filepath')


class NsDocumentRevisionReadOnlySerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField()
    document_type = serializers.StringRelatedField()
    document = serializers.StringRelatedField()
    document_format = serializers.StringRelatedField()

    class Meta:
        model = documents.models.NsDocumentRevision
        fields = ('id', 'project', 'document_type',
                  'document', 'document_id', 'revision',
                  'concise_description', 'verbose_description',
                  'document_format', 'filename', 'filepath')
        read_only_fields = ('filename', 'filepath')
