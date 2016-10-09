import unittest

from vodem.api import sms_page_data


class TestSmsPageData(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'messages': [],
        }

    def test_call_inbox(self):
        resp = sms_page_data({'tags': '12'})
        self.assertEqual(self.valid_response, resp)

    def test_call_outbox(self):
        resp = sms_page_data({'tags': '2'})
        self.assertEqual(self.valid_response, resp)

    def test_call_draftbox(self):
        resp = sms_page_data({'tags': '11'})
        self.assertEqual(self.valid_response, resp)
