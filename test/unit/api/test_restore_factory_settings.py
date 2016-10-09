import unittest

from vodem.api import restore_factory_settings


class TestRestoreFactorySettings(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        restore_factory_settings()
