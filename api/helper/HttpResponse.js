const constants = require('./Constants');
const Errors = require('./Errors');
const isUndefined = require('bvalid').isUndefined;

const sendError = (_r, e, e_idx, s_c) => {
	console.trace(e);
	var errMsg;
	var errCode;
	s_c = (isUndefined(s_c) || isUndefined(Errors[e_idx]))
		? constants.HTTP_STATUS.SERVER_ERROR : s_c;

	if(isUndefined(Errors[e_idx])) {
		errCode = errorCodes["server_error"][0]
		errMsg = errorCodes["server_error"][1];
	} else {
		errCode = Errors[e_idx][0]
		errMsg = Errors[e_idx][1];
	}

	return _r.status(s_c).send({
		code: errCode,
		err: errMsg,
		suc: false
	});
}

const sendSuccess = (_r,_d)=>{
	return _r.status(constants.HTTP_STATUS.OK).send({
		data: _d,
		suc: true
	})
}

module.exports = {
	sendError: sendError,
	sendSuccess: sendSuccess
};