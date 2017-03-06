from django.contrib import admin

import documents.models


# Register your models here.

@admin.register(documents.models.NsDocument)
class NsDocumentAdminModel(admin.ModelAdmin):
    fieldsets = (
        ('Project', {'fields': (('project', 'part'),)}),
        ('Type', {'fields': ('document_type', 'document_format', 'major_version', 'minor_version')}),
        ('Description', {'fields': ('concise_description', 'verbose_description')}),
    )


@admin.register(documents.models.NsDocumentType)
class NsDocumentTypeAdminModel(admin.ModelAdmin):
    fields = ('name', 'code',)


@admin.register(documents.models.NsDocumentFormat)
class NsDocumentFormatAdminModel(admin.ModelAdmin):
    fields = ('name', 'file_extension',)


@admin.register(documents.models.NsProject)
class NsProjectAdminModel(admin.ModelAdmin):
    fields = ('name',)


@admin.register(documents.models.NsPart)
class NsPartAdminModel(admin.ModelAdmin):
    fields = ('name', 'number')
