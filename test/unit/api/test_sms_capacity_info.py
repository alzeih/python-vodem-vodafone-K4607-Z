import unittest

from vodem.api import sms_capacity_info


class TestSmsCapacityInfo(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sms_nv_draftbox_total': '0',
            'sms_nv_rev_total': '0',
            'sms_nv_send_total': '0',
            'sms_nv_total': '100',
            'sms_sim_draftbox_total': '0',
            'sms_sim_rev_total': '0',
            'sms_sim_send_total': '0',
            'sms_sim_total': '0'
        }

    def test_call(self):
        resp = sms_capacity_info()
        self.assertEqual(self.valid_response, resp)
