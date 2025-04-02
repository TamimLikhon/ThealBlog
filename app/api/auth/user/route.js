// import { connectToDatabase } from "@/backend/lib/mongodb"; 
// import User from "@/backend/Schema/userSchema"; 

// export async function PUT(req) {
//     try {
//         await connectToDatabase(); 

//         const body = await req.json();
//         const { email, firstname } = body;

//         if (!email || !firstname) {
//             return new Response(JSON.stringify({ error: "Email and new firstname are required" }), {
//                 status: 400,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return new Response(JSON.stringify({ error: "User not found" }), {
//                 status: 404,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         user.firstname = firstname;
//         await user.save();

//         return new Response(JSON.stringify({ message: "Firstname updated successfully", user }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (error) {
//         console.error("Error in update firstname route:", error);
//         return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
// }


import { connectToDatabase } from "@/backend/lib/mongodb"; 
import User from "@/backend/Schema/userSchema"; 

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ firstname: user.firstname, imageUrl: user.imageUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in GET user route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const {imageUrl } = body;

        if ( !imageUrl) {
            return new Response(JSON.stringify({ error: " imageUrl are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const newUser = new User({ email, firstname, imageUrl });
        await newUser.save();

        return new Response(JSON.stringify({ message: "User created successfully", user: newUser }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in POST user route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { email, firstname, imageUrl } = body;

        if (!imageUrl) {
            return new Response(JSON.stringify({ error: " imageUrl) are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (firstname) user.firstname = firstname;
        if (imageUrl) user.imageUrl = imageUrl;

        await user.save();

        return new Response(JSON.stringify({ message: "User updated successfully", user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in PUT user route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
