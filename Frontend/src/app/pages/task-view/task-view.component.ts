import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent {

  
  lists: any;
  tasks: any;

  selectedListId: string='';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router){
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if(params['listId']) {
          this.selectedListId = params['listId'];
          console.log(this.selectedListId);
        
      this.taskService.getTasks(params['listId']).subscribe((tasks: Object) => 
        {
            this.tasks = tasks;
        })

      }
      }
    )

    this.taskService.getLists().subscribe((lists: Object) => {
        this.lists = lists;
    })
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }

 onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter((val: { _id: string; }) => val._id !== id);
      console.log(res);
    })
  }

}
