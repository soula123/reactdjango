from django.urls import path
from . import views

urlpatterns = [
    path('test_connection/', views.test_connection, name='test_connection'),
    path('show_tables/', views.show_tables, name='show_tables'),

]
