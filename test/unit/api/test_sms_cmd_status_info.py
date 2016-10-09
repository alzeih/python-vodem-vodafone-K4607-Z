import unittest

from vodem.api import sms_cmd_status_info


class TestSmsCmdStatusInfo(unittest.TestCase):

    def test_call_message_center(self):
        # self.valid_response = {
        #    'sms_cmd' : '3',
        #    'sms_cmd_status_result' : '3',
        #    }
        # returns garbage until sms_cmd is used
        self.valid_response = {'messages': []}
        resp = sms_cmd_status_info({'sms_cmd': '3'})
        self.assertEqual(self.valid_response, resp)

    def test_call_sms_send(self):
        # self.valid_response = {
        #    'sms_cmd' : '4',
        #    'sms_cmd_status_result' : '3',
        #    }
        # returns garbage until sms_cmd is used
        self.valid_response = {'messages': []}
        resp = sms_cmd_status_info({'sms_cmd': '4'})
        self.assertEqual(self.valid_response, resp)

    def test_call_sms_save(self):
        # self.valid_response = {
        #    'sms_cmd' : '5',
        #    'sms_cmd_status_result' : '3',
        #    }
        # returns garbage until sms_cmd is used
        self.valid_response = {'messages': []}
        resp = sms_cmd_status_info({'sms_cmd': '5'})
        self.assertEqual(self.valid_response, resp)

    def test_call_sms_delete(self):
        self.valid_response = {
            'sms_cmd': '6',
            'sms_cmd_status_result': '3',
        }
        resp = sms_cmd_status_info({'sms_cmd': '6'})
        self.assertEqual(self.valid_response, resp)
