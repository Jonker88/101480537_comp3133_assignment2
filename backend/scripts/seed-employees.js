/**
 * Populates sample employees for demos/screenshots.
 * Usage: from backend/, run: npm run seed
 * Requires MONGO_URI in .env (or environment).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const samples = [
    {
        first_name: 'Sarah',
        last_name: 'Chen',
        email: 'sarah.chen@northbridge.tech',
        gender: 'Female',
        designation: 'Senior Software Engineer',
        salary: 118_500,
        date_of_joining: new Date('2021-03-15'),
        department: 'Engineering',
        employee_photo: null,
    },
    {
        first_name: 'Marcus',
        last_name: 'Johnson',
        email: 'marcus.johnson@northbridge.tech',
        gender: 'Male',
        designation: 'HR Specialist',
        salary: 72_400,
        date_of_joining: new Date('2019-08-01'),
        department: 'Human Resources',
        employee_photo: null,
    },
    {
        first_name: 'Priya',
        last_name: 'Patel',
        email: 'priya.patel@northbridge.tech',
        gender: 'Female',
        designation: 'Financial Analyst',
        salary: 81_200,
        date_of_joining: new Date('2022-01-10'),
        department: 'Finance',
        employee_photo: null,
    },
    {
        first_name: 'David',
        last_name: 'Okonkwo',
        email: 'david.okonkwo@northbridge.tech',
        gender: 'Male',
        designation: 'Operations Manager',
        salary: 96_000,
        date_of_joining: new Date('2018-05-20'),
        department: 'Operations',
        employee_photo: null,
    },
    {
        first_name: 'Elena',
        last_name: 'Rodriguez',
        email: 'elena.rodriguez@northbridge.tech',
        gender: 'Female',
        designation: 'DevOps Engineer',
        salary: 105_750,
        date_of_joining: new Date('2023-07-05'),
        department: 'Engineering',
        employee_photo: null,
    },
];

async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('Missing MONGO_URI');
        process.exit(1);
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    let inserted = 0;
    let skipped = 0;
    for (const doc of samples) {
        try {
            await Employee.create(doc);
            inserted += 1;
            console.log(`Inserted: ${doc.first_name} ${doc.last_name}`);
        } catch (e) {
            if (e.code === 11000) {
                skipped += 1;
                console.log(`Skipped (exists): ${doc.email}`);
            } else {
                throw e;
            }
        }
    }

    console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`);
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
