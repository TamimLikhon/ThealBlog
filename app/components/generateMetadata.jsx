export async function generateMetadata({ params }) {
    const { title } = params;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchpost?title=${title}`);
        const post = await response.json();

        return {
            title: post.title || "Post Not Found",
            description: post.content?.substring(0, 150) || "No content available",
        };
    } catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            title: "Post Not Found",
            description: "The requested post could not be found.",
        };
    }
}
