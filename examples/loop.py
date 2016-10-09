""" An example of how to loop for input, process it, delete it """
import logging
import time

import vodem.simple

logging.basicConfig(level=logging.DEBUG)


def main():
    """ main loop """
    while True:
        # only works if no one is looking at the web interface
        count = vodem.simple.sms_get_flag()
        logging.info('New: %s', count)
        if count > 0:
            logging.info("getting new messages")
            for message in vodem.simple.sms_inbox_unread():
                logging.info('Received: %s', message)
                vodem.simple.sms_set_read(message['id'])
                vodem.simple.sms_delete(message['id'])
            vodem.simple.sms_set_flag()
        time.sleep(5)

if __name__ == '__main__':
    main()
