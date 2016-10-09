import logging

import unittest

from vodem.api import save_sms


class TestSaveSms(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_logs_defaults(self):
        params = {'SMSMessage': '0074006500730074'}
        with self.assertLogs(level=logging.DEBUG) as cm:
            save_sms(params)
