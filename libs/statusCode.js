"use strict";

/**
 * Error table. This module define the error ID and message.
 * @namespace ErrorCode
 */

var ErrorCode = {
  /**
   * @apiDefine ParameterError
   * @apiError ParameterError Input parameters are not correct.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 400 Bad Request
   *    {'code':400, 'id':'ParameterError', 'message':'Parameter error.'}
   */
  /** parameter error.*/
  'ParameterError': { 'code': 400, 'id': 'ParameterError', 'message': 'Parameter error.' },

  /**
   * @apiDefine LockedAccount
   * @apiError LockedAccount Account has locked.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 400 Bad Request
   *    { 'code': 400, 'id': 'LockedAccount', 'message': 'Locked account.' }
   */
  /** parameter error.*/
  'LockedAccount': { 'code': 400, 'id': 'LockedAccount', 'message': 'Locked account.' },

  /**
   * @apiDefine PayloadError
   * @apiError PayloadError The payload contains unacceptable items.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 409 Conflict
   *    {'code':409, 'id':'PayloadError', 'message':'The payload contains unacceptable items.'}
   */
  /** parameter error.*/
  'PayloadError': { 'code': 409, 'id': 'PayloadError', 'message': 'The payload contains unacceptable items.' },

  /**
   * @apiDefine Unauthorized
   * @apiError Unauthorized User is not login or access key is unavaiable.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unauthorized
   *    {'code':401, 'id':'Unauthorized', 'message':'Unauthorized.'}
   */
  /** Unauthorized .*/
  'Unauthorized': { 'code': 401, 'id': 'Unauthorized', 'message': 'Unauthorized.' },

  /**
   * @apiDefine Unauthorized
   * @apiError Unauthorized User is not login or access key is unavaiable.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unauthorized
   *    {'code':401, 'id':'Unauthorized', 'message':'Unauthorized.'}
   */
  /** Unauthorized .*/
  'PermissionDenied': { 'code': 401, 'id': 'Permission denied', 'message': 'Permission denied.' },

  /**
   * @apiDefine Unsupported Media Type
   * @apiError MediaNotSupport Unsupported Media Type.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 415 Unsupported Media Type
   *    {'code':415, 'id':'MediaNotSupport', 'message':'Unsupported Media Type.'}
   */
  /** Unsupported Media Type.*/
  'MediaNotSupport': {'code':415, 'id':'MediaNotSupport', 'message':'Unsupported Media Type.'},

  /**
   * @apiDefine NotSupport
   * @apiError NotSupport Request not support.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 405 Method Not Allowed
   *    {'code':405, 'id':'NotSupport', 'message':'Request not support.'}
   */
  /** Request not support.*/
  'NotSupport': { 'code': 405, 'id': 'NotSupport', 'message': 'Request not support.' },

  /**
   * @apiDefine Forbidden
   * @apiError Forbidden Access forbidden.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {'code': 403, 'id':'Forbidden', 'message':'Forbidden.'}
   */
  /** Access forbidden.*/
  'Forbidden': { 'code': 403, 'id': 'Forbidden', 'message': 'Forbidden.' },

  /**
   * @apiDefine ObjectNotFound
   * @apiError ObjectNotFound Object not found.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 404 Not Found
   *    {'code': 404, 'id':'ObjectNotFound', 'message':'Object not found.'}
   */
  /** Object not found.*/
  'ObjectNotFound': { 'code': 404, 'id': 'ObjectNotFound', 'message': 'Object not found.' },

  /**
   * @apiDefine ConflictError
   * @apiError ConflictError Object Conflict.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 409 Conflict
   *    {'code': 409, 'id':'ConflictError', 'message':'Part of the request can\'t complete.'}
   */
  /** Object Conflict.*/
  'ConflictError': { 'code': 409, 'id': 'ConflictError', 'message': 'Part of the request can\'t complete.' },

  /**
   * @apiDefine DatabaseError
   * @apiError DatabaseError Internal database error.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'DatabaseError', 'message':'Internal database error.'}
   */
  /** Database error.*/
  'DatabaseError': { 'code': 500, 'id': 'DatabaseError', 'message': 'Internal database error.' },

  /**
   * @apiDefine DatabaseNotReady
   * @apiError DatabaseNotReady Not connect to Database service.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'DatabaseNotReady', 'message':'Not connect to Database service.'}
   */
  /** Database error.*/
  'DatabaseNotReady': { 'code': 500, 'id': 'DatabaseNotReady', 'message': 'Not connect to Database service.' },

  /**
   * @apiDefine DuplicateUniqueKeyError
   * @apiError DuplicateUniqueKeyError Duplicate key error.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':406, 'id':'DuplicateUniqueKeyError', 'message':'Can't assing duplicate key.'}
   */
  /** Database error.*/
  'DuplicateUniqueKeyError': { 'code': 406, 'id': 'DuplicateUniqueKeyError', 'message': 'Can\'t assing duplicate key.' },

  /**
   * @apiDefine InternalError
   * @apiError InternalError Unexpected error.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'InternalError', 'message':'Unexpected error.'}
   */
  /** Unexpected error.*/
  'InternalError': { 'code': 500, 'id': 'InternalError', 'message': 'Unexpected error.' },

  /**
   * @apiDefine UnCatchedError
   * @apiError InternalError Uncatched error.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'InternalError', 'message':'Unexpected error.'}
   */
  /** Unexpected error.*/
  'UnCatchedError': { 'code': 500, 'id': 'UnCatchedError', 'message': 'Uncatched error.' },

  /**
   * @apiDefine EncryptError
   * @apiError EncryptError Encrypt error.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'EncryptError', 'message':'Encrypt error.'}
   */
  /** Encrypt error.*/
  'EncryptError': { 'code': 500, 'id': 'EncryptError', 'message': 'Encrypt error.' },

  /**
   * @apiDefine DecryptError
   * @apiError DecryptError Encrypt error.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'DecryptError', 'message':'Decrypt error.'}
   */
  /** Decrypt error.*/
  'DecryptError': { 'code': 500, 'id': 'DecryptError', 'message': 'Decrypt error.' },

  /**
  * @apiDefine PaymentError
  * @apiError PaymentError Third party payment service report error.
  * @apiErrorExample {json} Error-Response:
  *    HTTP/1.1 409 Conflict
  *    {'code':409, 'id':'PaymentError', 'message':'Third party payment service report error.'}
  */
  /** Third party error.*/
  'PaymentError': { 'code': 409, 'id': 'PaymentError', 'message': 'Third party payment service report error.' },

  /**
   * @apiDefine MailError
   * @apiError MailError Fail to send mail.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'MailError', 'message':'Fail to send mail.'}
   */
  /** Database error.*/
  'MailError': {'code':500, 'id':'MailError', 'message':'Fail to send mail.'},

  /**
   * @apiDefine Error104
   * @apiError Error104 Fail to from 104 service.
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 500 Internal Server Error
   *    {'code':500, 'id':'Error104', 'message':'Fail to from 104 service.'}
   */
  /** Database error.*/
  'Error104': {'code':500, 'id':'Error104', 'message':'Fail to from 104 service.'}
};

var SuccessCode = {
  /**
   * @apiDefine Created
   * @apiSuccess Created Action in queue.
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 201 Created
   *    {'code':201, 'id':'Created', 'message':'Action in queue.'}
   */
  /** Action in queue.*/
  'Created': { 'code': 201, 'id': 'Created', 'message': 'Action in queue.' },
  /**
   * @apiDefine Accepted
   * @apiSuccess Acceptd accept the Action.
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 202 Accepted
   *    {'code':202, 'id':'Accepted', 'message':'Action accepted.'}
   */
  /** Action in queue.*/
  'Accepted': { 'code': 202, 'id': 'Accepted', 'message': 'Action accepted.' },
  /**
   * @apiDefine NoContent
   * @apiSuccess NoContent Update content success and no content return.
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 204 No Contect
   *    {'code':204, 'id':'NoContent', 'message':'Success no content.'}
   */
  /** Success no content.*/
  'NoContent': { 'code': 204, 'id': 'NoContent', 'message': 'Success no content.' },
};

// for(let key of Object.keys(ErrorCode)){
//   ErrorCode[key].prototype = Error.prototype;
// }

exports.ErrorCode = ErrorCode;
exports.SuccessCode = SuccessCode;
exports.ErrorKeys = Object.keys(ErrorCode);