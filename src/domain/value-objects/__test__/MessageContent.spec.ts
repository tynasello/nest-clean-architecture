import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { MessageContent } from '../message/MessageContent';

describe('MessageContent', () => {
  it('should return successful result with message when props are valid', () => {
    const validMessage = 'valid password';
    const messageOrError = MessageContent.create(validMessage);
    expect(messageOrError.isSuccess).toBe(true);
    expect(messageOrError.getValue().value).toBe(validMessage);
  });

  it('should return failed result when message content is null', () => {
    const messageOrError = MessageContent.create(null);
    expect(messageOrError.isFailure).toBe(true);
    expect(messageOrError.getError()).toMatchObject({
      code: CUSTOM_ERRORS.USER_INPUT_ERROR,
      msg: `message content must be less than or equal to ${MessageContent.maxMessageContentLength} characters long`,
    });
  });

  it('should return failed result when message is too long', () => {
    const longMessage =
      'npawlquhpjbgibegbvtjgupkiwzvwpthhxnjzxiznwsybgdtznhslwctvfyncosfdjwcyvuyjmhjylakboooshtzghrmadbenyold';
    const messageOrError = MessageContent.create(longMessage);
    expect(messageOrError.isFailure).toBe(true);
    expect(messageOrError.getError()).toMatchObject({
      code: CUSTOM_ERRORS.USER_INPUT_ERROR,
      msg: `message content must be less than or equal to ${MessageContent.maxMessageContentLength} characters long`,
    });
  });
});
