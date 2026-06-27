from django.urls import path, register_converter
from . import views
from . import converters

register_converter(converters.FourDigitYearConverter, "year4")

urlpatterns = [
    path('', views.index, name='home'),
    path('cats/<int:id>/', views.categories, name='cats'),
    
    #path('about/', views.about, name='about'),


]


