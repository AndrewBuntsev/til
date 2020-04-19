export default function getTypeFromObject<T>(obj: Object): T {
    return obj as T;
}