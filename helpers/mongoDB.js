const mongoose = require(`mongoose`)
mongoose.connect(settings.mongoDB,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log(`[MONGO] connection established`)).catch(()=> console.log(`[MONGO] connection could not be established`))
