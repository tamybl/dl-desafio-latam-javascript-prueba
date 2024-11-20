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
    sortTasks():TaskI[] {
        const orderTasks = this.tasks.sort((a, b) => {
            const dateA: number = new Date(a.final_date).getTime();
            const dateB: number = new Date(b.final_date).getTime();
            if(dateA < dateB) {
                return -1;
            }
            if(dateA > dateB) {
                return 1;
            }
            return  0;
        })
        return orderTasks;       
    }
}

// PARTE I: CASOS DE USO
// Crear tareas
const task1 = new Task(1, 'Revisar el diseño del sitio web', 'pending', '2024-11-22');
const task2 = new Task(2, 'Implementar funcionalidad de búsqueda', 'in progress', '2024-11-20');
const task3 = new Task(3, 'Corregir errores en formulario de contacto', 'completed', '2024-11-19');
const task4 = new Task(3, 'Despublicar huincha de información', 'completed', '2024-11-19');

// Crear un proyecto
const project = new Project(101, 'Actualización del sitio web', '2024-15-11');

// Agregar tareas al proyecto
project.addTask(task1);
project.addTask(task2);
project.addTask(task3);
project.addTask(task4);

// Generar un resumen del estado de las tareas
const resume = project.resumeProject();
console.log('Resume Tasks:', resume);

// Ordenar tareas
const orderTasks = project.sortTasks();
console.log('Order by Deadline:', orderTasks);

// PARTE II
type Operation = (tarea: TaskI) => boolean;
function filterTaskByProject(project: Project, functionFilter: Operation):TaskI[] {
    return project.tasks.filter(functionFilter);
}

function calculateTime(project: Project):number {
    const day = 24*60*60*1000;
    const calculate = project.tasks.reduce((acc, task) => {
        const dateToday = new Date(today).getTime();
        const dateTask = new Date(task.final_date).getTime();
        if(dateTask > dateToday) {
            const diff = dateTask - dateToday;
            acc = (acc || 0) + Math.round(diff/day);
        }
        return acc;
    }, 0)
    return calculate;
}

function getCriticalTask(project: Project):TaskI[] {
    const dateToday = new Date(today).getTime();
    const day = 24*60*60*1000;
    return project.tasks.filter((task) => {
        const dateTask = new Date(task.final_date).getTime();
        const diff = Math.round((dateTask - dateToday)/day);
        return (diff <= 3 && diff >= 0);
    })
}

// PARTE II: CASOS DE USO
// Filtrar tareas del proyecto
const today = new Date().toLocaleDateString('en-CA')
const isCompleted = (task: TaskI) => task.status === "completed";
const isActive = (task: TaskI) => task.final_date >= today;

const tasksCompleted = filterTaskByProject(project, isCompleted);
const tasksActive = filterTaskByProject(project, isActive);
console.log('Completed Task:', tasksCompleted);
console.log('Active Tasks:', tasksActive);

// Calcular tiempo restante
const daysLeft = calculateTime(project);
console.log('Days left:', daysLeft);

// Calcular tareas criticas
const criticalTasks = getCriticalTask(project);
console.log('Critical Tasks:', criticalTasks);

// PARTE 3
// Para no repetir codigo y añadir nuevas funcionalidades, se extiende APIProject agregando todos los atributos y métodos de Project.
class APIProject extends Project {
    constructor(id: number, name: string, initial_date: string) {
        super(id, name, initial_date);
    }
    /* Simular llamada a una API para cargar los detalles */
    async loadProjectDetails(): Promise<void> {
        console.log(`Loading details for project: ${this.id}`);
        const projectDetails = await new Promise<ProjectI>((resolve) => {
            setTimeout(() => {
                resolve({
                    id: this.id,
                    name: this.name,
                    initial_date: this.initial_date,
                    tasks: [
                        { id: 1, description: "Actualizar imágenes landing concurso", status: "pending", final_date: "2024-11-22" },
                        { id: 2, description: "Crear documentación para capacitaciones", status: "in progress", final_date: "2024-11-20" },
                        { id: 3, description: "Ajustar diseño Home segun Figma", status: "completed", final_date: "2024-11-18" }
                    ],
                });
            }, 2000); // Simula un retraso de 2 segundos
        });
        this.tasks = projectDetails.tasks;
        console.log("Project details loaded:", this.tasks);        
    }
    //
    async updateTaskStatus(taskId: number, newStatus: "pending" | "in progress" | "completed"): Promise<void> {
        console.log(`Updating status for task ${taskId} to ${newStatus}...`);
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) { // 80% de éxito
                    const task = this.tasks.find((t) => t.id === taskId);
                    if (task) {
                        task.status = newStatus;
                        console.log(`Task ${taskId} status updated to ${newStatus}.`);
                        resolve();
                    } else {
                        reject(new Error(`Task ${taskId} not found.`));
                    }
                } else {
                    reject(new Error(`Failed to update task ${taskId}.`));
                }
            }, 1000);
        });
    }
}

    // Lista de funciones que escuchan notificaciones de tareas completadas
const taskListeners: ((task: TaskI) => void)[] = [];
    // Notifica a los listeners cuando una tarea ha sido completada
notifyTaskCompletion(task: TaskI): void {
        taskListeners.forEach((listener) => listener(task));
    }
    //Registra un listener para tareas completadas.
    addTaskListener(listener: (task: TaskI) => void): void {
        taskListeners.push(listener);
    }

// PARTE 3: CASOS DE USO
const apiProject = new APIProject(101, "API Project ", "2024-11-01");

(async () => {
    await apiProject.loadProjectDetails();
})();

// Actualizar estado de una tarea
(async () => {
    try {
        await updateTaskStatus(2, "completed");
        console.log("Task status updated successfully!");
    } catch (error) {
        console.error(error.message);
    }
})();

// Agregar un listener que notifique en la consola cuando una tarea se complete
addTaskListener((task) => {
    console.log(`Notification: Task ${task.id} has been completed!`);
});

// Completar una tarea y disparar la notificación
const completedTask: TaskI = { id: 3, description: "Task 3", status: "completed", final_date: "2024-11-18" };
notifyTaskCompletion(completedTask);