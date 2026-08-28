
const validate = (schema,source="body") => async (req,res,next) => {

    try{
        const validatedData = await schema.parseAsync(req[source]);

        if (source === "body") {
            req.body = validatedData;
        } else {
            req.validatedQuery = validatedData;
        }

        next();
    }
    catch(err){
        return next(err);
    }
}

module.exports = validate
