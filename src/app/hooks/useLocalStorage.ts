const useLocalStorage = () => {
  const setItem = (key: string, data: string) => {
    localStorage.setItem(key, data)
  }

  const getItem = (key: string) => localStorage.getItem(key)

  const removeItem = (key: string) => localStorage.removeItem(key)

  return { setItem, getItem, removeItem }
}

export default useLocalStorage
