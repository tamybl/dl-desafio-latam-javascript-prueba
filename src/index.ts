// PARTE I
interface TaskI {
    id: number;
    description: string;
    status: "pending" | "in progress" | "completed";
    final_date: string;
}

interface ProjectI {
    id: number;
    name: string;
    initial_date: string;
    tasks: TaskI[];
}

class Task implements TaskI {
    constructor(public id:number, public description:string, public status: "pending" | "in progress" | "completed", public final_date:string
    ) {}
}

class Project implements ProjectI {
    tasks: TaskI[] = [];
    constructor(public id:number, public name:string, public initial_date: string ) {
    }
    addTask(task:TaskI):void {
        this.tasks.push(task);
    }
    resumeProject():Record<"pending" | "in progress" | "completed", number>{ 
        const resumeTasks = this.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<"pending" | "completed" | "in progress", number>)
        //console.log('Resume Tasks:', resumeTasks);
        return resumeTasks;
    }
    sortTasks():void {
        const orderTaks = this.tasks.sort((a, b) => {
            const dateA: number = new Date(a.final_date).getTime();
            const dateB: number = new Date(b.final_date).getTime();
            if(dateA > dateB) {
                return -1;
            }
            if(dateA < dateB) {
                return 1;
            }
            return  0;
        })
        console.log('Order by Deadline:', orderTaks);
    }
}

// PARTE I: CASOS DE USO
// Crear tareas
const task1 = new Task(1, 'Revisar el diseño del sitio web', 'pending', '22-11-2024');
const task2 = new Task(2, 'Implementar funcionalidad de búsqueda', 'in progress', '20-11-2024');
const task3 = new Task(3, 'Corregir errores en formulario de contacto', 'completed', '19-11-2024');
const task4 = new Task(3, 'Despublicar huincha de información', 'completed', '19-11-2024');

// Crear un proyecto
const project = new Project(101, 'Actualización del sitio web', '15-11-2024');

// Agregar tareas al proyecto
project.addTask(task1);
project.addTask(task2);
project.addTask(task3);
project.addTask(task4);

// Generar un resumen del estado de las tareas
const resume = project.resumeProject();
console.log(resume);
// PARTE 2

