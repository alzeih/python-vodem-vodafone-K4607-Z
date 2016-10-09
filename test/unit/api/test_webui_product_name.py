import unittest

from vodem.api import webui_product_name


class TestWebuiProductName(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'webui_product_name': 'quickstart'
        }

    def test_call(self):
        resp = webui_product_name()
        self.assertEqual(self.valid_response, resp)

    def test_call_with_multi_data(self):
        resp = webui_product_name({'multi_data': '1'})
        self.assertEqual(self.valid_response, resp)
