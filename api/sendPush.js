const admin = require('firebase-admin');

if (!admin.apps.length) {

    admin.initializeApp({

        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    });
}

module.exports = async (req, res) => {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {

        const { token, title, body, data } = req.body;

        const response = await admin.messaging().send({

            token,

            notification: {
                title,
                body
            },

            data: data || {}
        });

        return res.status(200).json({
            success: true,
            response
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            error: e.message
        });
    }
};
