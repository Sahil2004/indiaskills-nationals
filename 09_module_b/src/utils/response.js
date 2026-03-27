export function error(res, status, message) {
    return res.status(400).json({
        success: false,
        message: message
    })
}

export function success(res, status, data, meta = null) {
    if (!meta)
        return res.status(status).json({
            success: true,
            data: data
        })
    else
        return res.status(status).json({
            success: true,
            data: data,
            meta: meta
        })
}

export function validationError(validationResult, req, res) {
    if (!validationResult(req).isEmpty()) error(res, 400, "Validation Failed")
}