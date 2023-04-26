function generateId()
{
    const prefix: string = "id";
    
    return prefix + Date.now().toString(36);
}

export
{
    generateId
}