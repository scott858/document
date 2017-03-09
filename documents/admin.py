from django.contrib import admin

import documents.models


# Register your models here.


class NsDocumentRevisionInline(admin.StackedInline):
    fields = (('project', 'document_type', 'document_format',),
              ('concise_description', 'verbose_description'))
    model = documents.models.NsDocumentRevision

    ordering = ('-id',)

    def get_extra(self, request, obj=None, **kwargs):
        return 1

    def get_queryset(self, request):
        queryset = super(NsDocumentRevisionInline, self).get_queryset(request).order_by('-id')
        if queryset.count():
            last_id = queryset.first().id
            queryset = queryset.filter(id__exact=last_id)
        return queryset


@admin.register(documents.models.NsDocument)
class NsDocumentAdminModel(admin.ModelAdmin):
    readonly_fields = ('__str__', 'created', 'modified')
    inlines = [
        NsDocumentRevisionInline
    ]


class NsDocumentRevisionAdminModel(admin.ModelAdmin):
    fields = (('project', 'document', 'document_type', 'document_format',),
              ('concise_description', 'verbose_description'))


@admin.register(documents.models.NsDocumentType)
class NsDocumentTypeAdminModel(admin.ModelAdmin):
    fields = ('name', 'code',)


@admin.register(documents.models.NsDocumentFormat)
class NsDocumentFormatAdminModel(admin.ModelAdmin):
    fields = ('name', 'file_extension',)


@admin.register(documents.models.NsProject)
class NsProjectAdminModel(admin.ModelAdmin):
    fields = ('name',)
