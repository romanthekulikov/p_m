function getProperty(properties: Object, propertyName: string): unknown
{
    return properties[propertyName as keyof typeof properties];
}

export
{
    getProperty,
}