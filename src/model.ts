export interface Examination {
    id: string;
    date: string;
    symptoms: Symptom[];
    pulseImage: string;
    muscleTests: MuscleTest[];
    treatments: Treatment[];
    diagnosis: string;
    notes: string;
    notesImage:string;
}

export interface User {
    id: string;
    name?: string;
    surname?: string;
    age?: number;
    email?: string;
    phone?: string;
    examinations?: Examination[];
}

export interface Symptom {
    name: string;
    isChecked: boolean;
}

export interface MuscleTest{
    name: string;
    isChecked: boolean;
    result: string;
}

export interface Treatment {
    name: string;
    isChecked: boolean;
    expandable: boolean;
    description: string;
}