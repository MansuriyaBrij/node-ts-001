export const validate = (schema, target = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: result.error.issues.map((error) => ({
                    name: error.path.join('.'),
                    message: error.message,
                })),
            });
            return;
        }
        req[target] = result.data;
        next();
    };
};
