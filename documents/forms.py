from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from documents.models import NsDocument


class NsDocumentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(NsDocumentForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_id = 'id-documentForm'
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('save', 'save'))

    class Meta:
        model = NsDocument
        fields = ('project', 'document_type', "part",
                  'concise_description', 'verbose_description',
                  'major_version', 'minor_version',
                  'document_format')
