import { defineStore } from 'pinia'
import { computed, ref, inject, toRaw } from 'vue'
import { User } from '@/model'
import { Storage } from '@ionic/storage';

export const useGlobalStore = defineStore('global', () => {
    const users = ref<User[]>([])
    const ionicStore = inject('storage') as Storage;
    const fetchUsers = computed(() => {
        return users.value ?? []
    })
    const updateRemoteBase = async()=>{
        try{
            const res = await fetch('https://akupunkturaigla.pl/api/state/up?param=martamarta321!', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base: {users: toRaw(users.value)},
                })
            });
            if (!res.ok) {
            console.log("Wystąpił błąd podczas synchronizacji")
            } else {
            console.log("Synchronizacja zakończona")
            }
        }catch (error) {
            console.log("Wystąpił błąd podczas synchronizacji")
            console.error('Error:', error);
        }
    }
    const setUsers = async (usersList: User[]) => {
        users.value = usersList
        await ionicStore.set('users', toRaw(users.value))
    }
    const addUser = async (user: User) => {
        await getUsers()
        if (users.value.findIndex((u: User) => u.id === user.id) !== -1) {
            const userIndex = users.value.findIndex((u: User) => u.id === user.id)
            users.value[userIndex] = user
            await ionicStore.set('users', toRaw(users.value))
            return
        }else{
            users.value.push(user)
            console.log('usersFetched', users.value)
            await ionicStore.set('users', toRaw(users.value))
        }
        await updateRemoteBase()
    }
    const removeUser = async(userId: string) => {
        const usersFetched = await ionicStore.get('users')
        const index = usersFetched.findIndex((u: User) => u.id === userId)
        if (index !== -1) {
            usersFetched.splice(index, 1)
            await ionicStore.set('users', toRaw(usersFetched))
        }
        users.value = usersFetched
        await updateRemoteBase()
    }

    const getUsers = async() => {
        users.value = await ionicStore.get('users') || []
        await downloadRemoteBase();
        return toRaw(users.value)
    }
    const addExamination = async(examination: any, userId: string) => {
        const usersFetched = await ionicStore.get('users')
        const userIndex = usersFetched.findIndex((u: User) => u.id === userId)
        if (userIndex !== -1) {
            const user = usersFetched[userIndex]
            if (!user.examinations) {
                user.examinations = []
            }
            if (user.examinations.findIndex((e: any) => e.id === examination.id) === -1) {
                user.examinations.push(examination)
                usersFetched[userIndex] = user
                await ionicStore.set('users', toRaw(usersFetched))
                users.value = usersFetched
            }else{
                const examinationIndex = user.examinations.findIndex((e: any) => e.id === examination.id)
                if (examinationIndex !== -1) {
                    user.examinations[examinationIndex] = examination
                    usersFetched[userIndex] = user
                    await ionicStore.set('users', toRaw(usersFetched))
                    users.value = usersFetched
                }
            }
        }
        await updateRemoteBase()

    }
    const deleteExamination = async(examinationId: string, userId: string) => {
        const usersFetched = await ionicStore.get('users')
        const userIndex = usersFetched.findIndex((u: User) => u.id === userId)
        if (userIndex !== -1) {
            const user = usersFetched[userIndex]
            if (user.examinations) {
                const examinationIndex = user.examinations.findIndex((e: any) => e.id === examinationId)
                if (examinationIndex !== -1) {
                    user.examinations.splice(examinationIndex, 1)
                    usersFetched[userIndex] = user
                    await ionicStore.set('users', toRaw(usersFetched))
                    users.value = usersFetched
                }
            }
        }
        await updateRemoteBase()
    }
    const getExaminations = async(userId: string) => {
        const usersFetched = await ionicStore.get('users')
        const userIndex = usersFetched.findIndex((u: User) => u.id === userId)
        if (userIndex !== -1) {
            const user = usersFetched[userIndex]
            if (user.examinations) {
                return user.examinations
            }
        }
        return []
    }

    const downloadRemoteBase = async()=>{
        try{
            const res = await fetch('https://akupunkturaigla.pl/api/state/down?param=martamarta321!', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log(JSON.parse(data.base).base.users)
            setUsers(JSON.parse(data.base).base.users)
            if (res.ok) {
                console.log("Synchronizacja zakończona")
            } else {
                console.log("Wystąpił błąd podczas synchronizacji")
            }
        }catch (error) {
                console.log("Wystąpił błąd podczas synchronizacji")
            console.error('Error:', error);
        }
    }
    return { users, addUser, removeUser, getUsers, addExamination, getExaminations, deleteExamination, setUsers, fetchUsers, downloadRemoteBase }
})