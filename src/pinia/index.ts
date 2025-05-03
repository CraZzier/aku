import { defineStore } from 'pinia'
import { computed, ref, inject, toRaw } from 'vue'
import { User } from '@/model'
import { Storage } from '@ionic/storage';

export const useGlobalStore = defineStore('global', () => {
    const users = ref<User[]>([])
    const ionicStore = inject('storage') as Storage;

    const addUser = async (user: User) => {
        await getUsers()
        users.value.push(user)
        console.log('usersFetched', users.value)
        await ionicStore.set('users', toRaw(users.value))
    }
    const removeUser = async(user: User) => {
        const usersFetched = await ionicStore.get('users')
        const index = usersFetched.findIndex((u: User) => u.email === user.email)
        if (index !== -1) {
            usersFetched.splice(index, 1)
            await ionicStore.set('users', toRaw(usersFetched))
        }
        users.value = usersFetched
    }
    const getUsers = async() => {
        users.value = await ionicStore.get('users') || []
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
            user.examinations.push(examination)
            usersFetched[userIndex] = user
            await ionicStore.set('users', toRaw(usersFetched))
            users.value = usersFetched
        }
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
    return { users, addUser, removeUser, getUsers, addExamination, getExaminations }
})