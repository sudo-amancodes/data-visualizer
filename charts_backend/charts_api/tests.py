from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.

class ChartDataTests(APITestCase):
    def test_candlestick_data(self):
        url = reverse('candlestick-data')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertIsInstance(response.data["data"], list)
        self.assertGreater(len(response.data["data"]), 0)
        self.assertIn("x", response.data["data"][0])
        self.assertIn("open", response.data["data"][0])
        self.assertIn("high", response.data["data"][0])
        self.assertIn("low", response.data["data"][0])
        self.assertIn("close", response.data["data"][0])

    def test_line_chart_data(self):
        url = reverse('line-chart-data')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("labels", response.data)
        self.assertIn("data", response.data)
        self.assertIsInstance(response.data["labels"], list)
        self.assertIsInstance(response.data["data"], list)
        self.assertGreater(len(response.data["labels"]), 0)
        self.assertGreater(len(response.data["data"]), 0)

    def test_bar_chart_data(self):
        url = reverse('bar-chart-data')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("labels", response.data)
        self.assertIn("data", response.data)
        self.assertIsInstance(response.data["labels"], list)
        self.assertIsInstance(response.data["data"], list)
        self.assertGreater(len(response.data["labels"]), 0)
        self.assertGreater(len(response.data["data"]), 0)

    def test_pie_chart_data(self):
        url = reverse('pie-chart-data')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("labels", response.data)
        self.assertIn("data", response.data)
        self.assertIsInstance(response.data["labels"], list)
        self.assertIsInstance(response.data["data"], list)
        self.assertGreater(len(response.data["labels"]), 0)
        self.assertGreater(len(response.data["data"]), 0)
