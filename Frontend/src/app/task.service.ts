import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  createList(title: string) {
    return this.webReqService.post('lists',{ title });
  }

  getLists() {
    return this.webReqService.get('lists');
  }

  getTasks(listId: string) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }


  createTask(title: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/tasks`,{title});
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }

  updateList(id: string, title: string) {
    return this.webReqService.patch(`lists/${id}`, { title });
  }

 deleteTask(listId: string, taskId: string) {
  //delete task from a list
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title });
  }

  
}

