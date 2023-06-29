const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

const { List, Task } = require('./db/models');


//load middleware
app.use(bodyParser.json());

//Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
  });


/*   Route handlers  */

/*    list routes   */

//get all list
app.get('/lists', (req, res) => {
    //return array of list
    List.find({}).then((lists) => {
        res.send(lists);
    });
})


//create list
app.post('/lists', (req,res) => {
    //create a new list
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })
});


//update a list
app.patch('/lists/:id', (req, res) => {
    //update
    List.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({'message': 'updated successfully'});
    });
});

//delete a list
app.delete('/lists/:id', (req, res) => {
 //delete
 List.findOneAndRemove({_id: req.params.id}).then((removedListDoc) => {
    res.send(removedListDoc);

    deleteTasksFromList(removedListDoc._id);
 })
});



//Tasks
app.get('/lists/:listId/tasks', (req, res) => {
    //return all task that belong to a list
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    //return all task that belong to a list
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});

// /lists/:listId/tasks
app.post('/lists/:listId/tasks', (req, res) => {
    //create new task in new list
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
})


app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    //Update task

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // the currently authenticated user can update tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
})

/*   HELPER METHODS   */
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tasks from " + _listId + " were deleted!");
    })
}

app.listen(3000, () => {
    console.log("server is listening on port 3000");
})