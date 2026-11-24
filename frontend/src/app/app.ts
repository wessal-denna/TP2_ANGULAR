import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../interfaces/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  tasks: Task[] = [];
  editingId: string | null = null;

  addForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  editForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.cdr.detectChanges();
    });
  }

  addTask(): void {
    if (this.addForm.invalid) return;
    const newTask: Partial<Task> = {
      title: this.addForm.value.title ?? '',
      description: this.addForm.value.description ?? ''
    };
    this.taskService.addTask(newTask).subscribe(() => {
      this.addForm.reset({ title: '', description: '' });
      this.loadTasks();
    });
  }

  toggleTask(task: Task): void {
    this.taskService
      .updateTask(task._id!, { completed: !task.completed })
      .subscribe(() => this.loadTasks());
  }

  startEdit(task: Task): void {
    this.editingId = task._id!;
    this.editForm.setValue({
      title: task.title,
      description: task.description || ''
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(task: Task): void {
    if (this.editForm.invalid) return;
    const updatedTask: Partial<Task> = {
      title: this.editForm.value.title ?? '',
      description: this.editForm.value.description ?? ''
    };
    this.taskService.updateTask(task._id!, updatedTask).subscribe(() => {
      this.editingId = null;
      this.loadTasks();
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task._id!).subscribe(() => this.loadTasks());
  }
}
