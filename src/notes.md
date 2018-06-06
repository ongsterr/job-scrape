## **Mongoose**

### **Commonly Used Functions**

**Mongoose**

- `Mongoose.Collection()` - The Mongoose Collection constructor
- `Mongoose.Connection()` - The Mongoose Connection constructor. For practical reasons, a Connection equals a Db.
- `Mongoose.Model()` - The Mongoose Model constructor. Provides the interface to MongoDB collections as well as creates document instances.
- `Mongoose.Query()` - The Mongoose Query constructor. Query constructor used for building queries. You do not need to instantiate a Query directly. Instead use Model functions like `Model.find()`.
- `Mongoose.Schema()` - The Mongoose Schema constructor.
    ```js
    var child = new Schema({ name: String });
    var schema = new Schema({ name: String, age: Number, children: [child] });
    var Tree = mongoose.model('Tree', schema);

    // setting schema options
    new Schema({ name: String }, { _id: false, autoIndex: false })
    ```
- `Mongoose.connect()`
    - Parameters:
        - `uri(s)`
        - `[options]` passed down to the MongoDB driver's connect() function, except for 4 mongoose-specific options explained below.
        - `[options.user]` username for authentication, equivalent to options.auth.user. Maintained for backwards compatibility.
        - `[options.pass]` password for authentication, equivalent to options.auth.password. Maintained for backwards compatibility.
        - `[options.autoindex=true]` Mongoose-specific option. Set to false to disable automatic index creation for all models associated with this connection.
        - `[options.bufferCommands=true]` Mongoose specific option. Set to false to disable buffering on all models associated with this connection.
        - `[callback]`
    - Returns:
        - «Promise» resolves to `this` if connection succeeded
        - Opens the default mongoose connection
    ```js
    mongoose.connect('mongodb://user:pass@localhost:port/database');

    /* replica sets */
    var uri = 'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase';
    mongoose.connect(uri);

    /* with options */
    mongoose.connect(uri, options);

    /* optional callback that gets fired when initial connection completed */
    var uri = 'mongodb://nonexistent.domain:27000';
    mongoose.connect(uri, function(error) {
    /* if error is truthy, the initial connection failed. */
    })
    ```
- `Mongoose.connection` - The default connection of the mongoose module. This is the connection used by default for every model created using `mongoose.model`.
    ```js
    var mongoose = require('mongoose');
    mongoose.connect(...);
    mongoose.connection.on('error', cb);
    ```
- `Mongoose.disconnect()`
    - Parameters:
        - [callback] «Function» called after al l connection close, or when first error occurred.
    - Returns:
        - «Promise» resolves when all connections are closed, or rejects with the first error that occurred.
    - Runs `.close()` on all connections in parallel.
- `Mongoose.model()` - Models defined on the `mongoose` instance are available to all connection created by the same `mongoose` instance.
- `Mongoose.modelNames()`- Returns an array of model names created on this instance of Mongoose.
- `Mongoose.mquery` - The [mquery](https://github.com/aheckmann/mquery) query builder Mongoose uses.
- `Mongoose.plugin()` - Declares a global plugin executed on all Schemas. Equivalent to calling `.plugin(fn)` on each Schema you create.
- `Mongoose.pluralize()` - Getter/setter around function for pluralizing collection names.

**Schema**

- `Schema()` - Schema constructor i.e. `new Schema({...})`
- `Schema.Types`
    - String
    - Number
    - Boolean
    - Array
    - Buffer
    - Date
    - ObjectId
    - Mixed
- `Schema.add()` - Adds key path / schema type pairs to this schema.
- `Schema.index()` - Defines an index (most likely compound) for this schema. Example: `schema.index({ first: 1, last: -1 })`
- `Schema.indexes()` - Returns a list of indexes that this schema declares, via `schema.index()` or by `index: true` in a path's options.
- `Schema.method()` - Adds an instance method to documents constructed from Models compiled from this schema.
    ```js
    schema.method({
        purr: function () {},
        scratch: function () {}
    });

    /* later */
    fizz.purr();
    fizz.scratch();
    ```
- `Schema.path()`
    ```js
    schema.path('name') /* returns a SchemaType */
    schema.path('name', Number) /* changes the schemaType of `name` to Number */
    ```
- `Schema.plugin()` - Registers a plugin for this schema.
- `Schema.post()` - Defines a post hook for the document
    ```js
    var schema = new Schema(..);
    schema.post('save', function (doc) {
        console.log('this fired after a document was saved');
    });

    schema.post('find', function(docs) {
        console.log('this fired after you run a find query');
    });
    ```
- `Schema.pre()` - Defines a pre hook for the document.
    ```js
    toySchema.pre('save', function (next) {
        if (!this.created) this.created = new Date;
        next();
    })
    ```
- `Schema.queue()` - Adds a method call to the queue.
- `Scheme.remove()` - Removes the given path (or [paths]).
- `Schema.static()` - Adds static "class" methods to Models compiled from this schema.
    ```js
    var schema = new Schema(..);
    schema.static('findByName', function (name, callback) {
        return this.find({ name: name }, callback);
    });

    var Drink = mongoose.model('Drink', schema);
    Drink.findByName('sanpellegrino', function (err, drinks) {
        /* */
    });
    ```
    - If a hash of name/fn pairs is passed as the only argument, each name/fn pair will be added as statics.

**Connection**

- `Connection.close([force - boo], [callback])` - Closes the connection
- `Connection.config` - A hash of the global options that are associated with this connection
- `Connection.createCollection(collectionName, [options], [callback])` - Will explicitly create the given collection with specified options. Used to create capped collections and views from mongoose.
- `Connection.db` - The mongodb.Db instance, set when the connection is opened
- `Connection.dropCollection(collectionName, [callback])` - Will delete the given collection, including all documents and indexes.
- `Connection.dropDatabase([callback])` - Deletes the given database, including all collections, documents, and indexes.
- `Connection.host` - The host name portion of the URI. If multiple hosts, such as a replica set, this will contain the first host name in the URI
    ```js
    mongoose.createConnection('mongodb://localhost:27017/mydb').host; // "localhost"
    ```
- `Connection.model(modelName, [schema], [collection])` - Defines or retrieves a model.
- `Connection.name` - The name of the database this connection points to.
    ```js
    mongoose.createConnection('mongodb://localhost:27017/mydb').name; // "mydb"
    ```
- `Connection.pass` - The password specified in the URI
    ```js
    mongoose.createConnection('mongodb://val:psw@localhost:27017/mydb').pass; // "psw"
    ```
- `Connection.port` - The port portion of the URI. If multiple hosts, such as a replica set, this will contain the port from the first host name in the URI.
    ```js
    mongoose.createConnection('mongodb://localhost:27017/mydb').port; // 27017
    ```
- `Connection.readyState` - Each state change emits its associated event name.
    - 0 = disconnected
    - 1 = connected
    - 2 = connecting
    - 3 = disconnecting
    ```js
    conn.on('connected', callback);
    conn.on('disconnected', callback);
    ```
- `Connection.user` - The username specified in the URI
    ```js
    mongoose.createConnection('mongodb://val:psw@localhost:27017/mydb').user; // "val"
    ```

**Document**

- `Document.$ignore(path)` - Don't run validation on this path or persist changes to this path.
- `Document.$isDefault(path)` - Checks if a path is set to its default.
- `Document.$isDeleted()` - Getter/setter, determines whether the document was removed or not.
- `Document.$markValid(path)` - Marks a path as valid, removing existing validation errors.
- `Document.depopulate(path)` - Takes a populated field and returns it to its unpopulated state.
- `Document.equals(doc)` - Returns true if the Document stores the same data as doc.
- `Document.get(path, type)` - Returns the value of a path.
    - `doc.get('age', String)`
- `Document.id` - The string version of this documents _id.
- `Document.init(doc)` - Initializes the document without setters or marking anything modified.
- `Document.inspect()` - Helper for `console.log`
- `Document.invalidate(path, errorMsg, invalidValue, [kindForError])` - Marks a path as invalid, causing validation to fail.
    ```js
    doc.invalidate('size', 'must be less than 20', 14);
    ```
- `Document.isDirectModified(path)` - Returns true if path was directly set and modified, else false.
- `Document.isInit(path)` - Checks if path was initialized.
- `Document.isModified(path)` - Returns true if this document was modified, else false.
    ```js
    doc.set('documents.0.title', 'changed');
    doc.isModified()                      /* true */
    doc.isModified('documents')           /* true */
    doc.isModified('documents.0.title')   /* true */
    doc.isModified('documents otherProp') /* true */
    doc.isDirectModified('documents')     // false
    ```
- `Document.isNew()` - Boolean flag specifying if the document is new.
- `Document.isSelected(path)` - Checks if `path` was selected in the source query which initialized this document.
- `Document.populate(path, [callback])` - Populates document references, executing the `callback` when complete. If you want to use promises instead, use this function with `execPopulate()`
    ```js
    /* summary */
    doc.populate(path)                   /* not executed */
    doc.populate(options);               /* not executed */
    doc.populate(path, callback)         /* executed */
    doc.populate(options, callback);     /* executed */
    doc.populate(callback);              /* executed */
    doc.populate(options).execPopulate() /* executed, returns promise */
    ```
- `Document.populated(path)` - Gets `_id(s)` used during population of the given `path`. If the path was not populated, `undefined` is returned.
- `Document.save([options], [options.safe], [options.validateBeforeSave], [callback])`
    ```js
    product.sold = Date.now();
    product.save(function (err, product) {
        if (err) ..
    })
    ```
    - The callback will receive three parameters:
        - `err` if an error occurred
        - `product` which is the saved product
    - As an extra measure of flow control, save will return a Promise.
- `Document.toJSON([options])` - The return value of this method is used in calls to `JSON.stringify(doc)`.
- `Document.toObject([options])` - Converts this document into a plain javascript object, ready for storage in MongoDB.
    - Options:
        - `getters` apply all getters (path and virtual getters)
        - `virtuals` apply virtual getters (can override getters option)
        - `minimize` remove empty objects (defaults to true)
        - `transform` a transform function to apply to the resulting document before returning
            ```js
            function (doc, ret, options) {}
            ```
            - Transform functions receive three arguments:
                - `doc` The mongoose document which is being converted
                - `ret` The plain object representation which has been converted
                - `options` The options in use (either schema options or the options passed inline)
        - `depopulate` depopulate any populated paths, replacing them with their original refs (defaults to false)
        - `versionKey` whether to include the version key (defaults to true)
- `Document.toString()`
- `Document.update(doc, [options], [callback])` - Sends an update command with this document `_id` as the query selector.
- `Document.validate([options], [callback])` - Executes registered validation rules for this document.
- `Document.validateSync(pathsToValidate)` - Executes registered validation rules (skipping asynchronous validators) for this document.

**Model**

- `Model.aggregate([pipelineArray], [callback])` - Performs aggregations on the models collection.

- `Model.bulkWrite(opsArray, [optionsObj], [callback])` - Sends multiple `insertOne`, `updateOne`, `updateMany`, `replaceOne`, `deleteOne`, and/or `deleteMany` operations to the MongoDB server in one command. This is faster than sending multiple independent operations (like) if you use `create()` because with `bulkWrite()` there is only one round trip to MongoDB.
    ```js
    Character.bulkWrite([
    {
        insertOne: {
            document: {
                name: 'Eddard Stark',
                title: 'Warden of the North'
            }
        }
    },
    {
        updateOne: {
            filter: { name: 'Eddard Stark' },
            /* If you were using the MongoDB driver directly, you'd need to do `update: { $set: { title: ... } }` but mongoose adds $set for you. */
            update: { title: 'Hand of the King' }
        }
    },
    {
        deleteOne: {
            {
                filter: { name: 'Eddard Stark' }
            }
        }
    }
    ]).then(handleResult);
    ```

- `Model.count([conditionsObj], [callback])` - Counts number of matching documents in a database collection.

- `Model.create(doc, [callback])` - Shortcut for saving one or more documents to the database. `MyModel.create(docs)` does `new MyModel(doc).save()` for every doc in docs.
    ```js
    /* pass a spread of docs and a callback */
    Candy.create({ type: 'jelly bean' }, { type: 'snickers' }, function (err, jellybean, snickers) {
        if (err) /* ... */
    });
    ```

- `Model.deleteMany(conditionsObj, [callback])` - Deletes all of the documents that match `conditions` from the collection. Behaves like `remove()`, but deletes all documents that match conditions regardless of the single option.
    ```js
    Character.deleteMany({ name: /Stark/, age: { $gte: 18 } }, function (err) {});
    ```

- `Model.deleteOne(conditionsObj, [callback])` - Deletes the first document that matches `conditions` from the collection. Behaves like `remove()`, but deletes at most one document regardless of the single option.

- `Model.distinct(field, conditionsObj, [callback])` - Creates a Query for a `distinct` operation. Passing a `callback` immediately executes the query.

- `Model.find(conditionsObj, [projectionObj], [optionsObj], [callback])` - Finds documents. The `conditions` are cast to their respective SchemaTypes before the command is sent.
    ```js
    /* named john and at least 18 */
    MyModel.find({ name: 'john', age: { $gte: 18 }});

    /* executes immediately, passing results to callback */
    MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});

    /* name LIKE john and only selecting the "name" and "friends"  */fields, executing immediately
    MyModel.find({ name: /john/i }, 'name friends', function (err, docs) { })

    /* passing options */
    MyModel.find({ name: /john/i }, null, { skip: 10 })

    /* passing options and executing immediately */
    MyModel.find({ name: /john/i }, null, { skip: 10 }, function (err, docs) {});

    /* executing a query explicitly */
    var query = MyModel.find({ name: /john/i }, null, { skip: 10 })
    query.exec(function (err, docs) {});

    /* using the promise returned from executing a query */
    var query = MyModel.find({ name: /john/i }, null, { skip: 10 });
    var promise = query.exec();
    promise.addBack(function (err, docs) {});
    ```

- `Model.findById(_id, [projectionObj], [optionsObj], [callback])` - Finds a single document by its _id field.

- `Model.findByIdAndDelete(_id, [optionsObj], [callback])`
    - Issue a MongoDB `findOneAndDelete()` command by a document's _id field. In other words, `findByIdAndDelete(id)` is a shorthand for `findOneAndDelete({ _id: id })`.

- `Model.findByIdAndRemove(_id, [optionsObj], [callback])`
    - Issue a mongodb findAndModify remove command by a document's _id field. `findByIdAndRemove(id, ...)` is equivalent to `findOneAndRemove({ _id: id }, ...)`.

- `Model.findByIdAndUpdate(_id, [updateObj], [optionsObj], [options.lean], [callback])`
    - Issues a mongodb findAndModify update command by a document's _id field. `findByIdAndUpdate(id, ...)` is equivalent to `findOneAndUpdate({ _id: id }, ...)`.

- `Model.findOne([conditionsObj], [projectionObj], [optionsObj], [callback])`
    - Finds one document. The `conditions` are cast to their respective SchemaTypes before the command is sent.

- `Model.findOneAndDelete([conditionsObj], [optionsObj], [callback])`
    - Issue a MongoDB `findOneAndDelete()` command.
    - Finds a matching document, removes it, and passes the found document (if any) to the `callback`.
    - Executes immediately if callback is passed else a Query object is returned.

- `Model.findOneAndRemove([conditionsObj], [optionsObj], [callback])`
    - Issue a mongodb findAndModify remove command.
    - Finds a matching document, removes it, passing the found document (if any) to the callback.
    - Executes immediately if callback is passed else a Query object is returned.

- `Model.findOneAndUpdate([conditionsObj], [updateObj], [optionsObj], [options.lean], [callback])`
    - Issues a mongodb findAndModify update command.
    - Finds a matching document, updates it according to the update arg, passing any `options`, and returns the found document (if any) to the `callback`. The query executes immediately if callback is passed else a Query object is returned.

- `Model.insertMany(docs, [optionsObj], [options.ordered «Boolean» = true], [options.rawResult «Boolean» = false], [callback])`
    - Shortcut for validating an array of documents and inserting them into MongoDB if they're all valid. This function is faster than `.create()` because it only sends one operation to the server, rather than one for each document.
    - Mongoose always validates each document **before** sending `insertMany` to MongoDB. So if one document has a validation error, no documents will be saved, unless you set the `ordered` option to false.

- `Model.mapReduce(obj, [callback])` - Executes a mapReduce command.
    - `obj` is an object specifying all mapReduce options as well as the map and reduce functions. All options are delegated to the driver implementation. See [node-mongodb-native mapReduce() documentation](http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#mapreduce) for more detail about options.

- `Model.populate(docs, [optionsObj], [options.retainNullValues=false], [callback(err,doc)])`
    - Populates document references.

- `Model.$where` - Additional properties to attach to the query when calling `save()` and `isNew` is false.

- `Model.$where(arg)` - Creates a Query and specifies a `$where` condition.
    - Sometimes you need to query for things in mongodb using a JavaScript expression. You can do so via `find({ $where: javascript })`, or you can use the mongoose shortcut method $where via a Query chain or from your mongoose Model.
        ```js
        Blog.$where('this.username.indexOf("val") !== -1').exec(function (err, docs) {});
        ```

- `Model.remove([callback])` - Removes this document from the db.
    - As an extra measure of flow control, remove will return a Promise (bound to fn if passed) so it could be chained, or hooked to recieve errors

- `Model.save([optionsObj], [options.safe], [options.validateBeforeSave], [callback])` - Saves this document.

- `Model.schema` - Schema the model uses.

- `Model.remove([conditionsObj], [callback])`
    - Removes all documents that match `conditions` from the collection. To remove just the first document that matches `conditions`, set the `single` option to true.

- `Model.update([conditionsObj], docObj, [optionsObj], [callback])`
    - Updates one document in the database without returning it.

- `Model.updateMany([conditionsObj], docObj, [optionsObj], [callback])`
    - Same as `update()`, except MongoDB will update all documents that match `criteria` (as opposed to just the first one) regardless of the value of the `multi` option.

- `Model.updateOne([conditionsObj], docObj, [optionsObj], [callback])`
    - Same as `update()`, except MongoDB will update only the first document that match `criteria` (as opposed to just the first one) regardless of the value of the `multi` option.

- `Model.where(path, valObj)` - Creates a Query, applies the passed conditions, and returns the Query.
    ```js
    User.find({age: {$gte: 21, $lte: 65}}, callback);

    User.where('age').gte(21).lte(65).exec(callback);
    ```
    - Supports chaining:
        ```js
        User
        .where('age').gte(21).lte(65)
        .where('name', /^b/i)
        ... etc
        ```

**Query**
