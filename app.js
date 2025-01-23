const express = require('express');
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const { v4: uudiv4 } = require("uuid")

mongoose.connect("mongodb+srv://gugansathish2005:gugan123@cluster0.1gxtf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/expenses").then(() => {
    console.log("Connectrf to MongoDB");
});
const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: String, required: true },
})
const Expense = mongoose.model("Expense", expenseSchema);



app.get("/api/expenses", async(req, res) => {
    try {
    const expenses = await Expense.find();
    if (!expenses){
        res.status(404).send ({ message:"no expenses found"})
    }
    
    res.status(200).json(expenses);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get("/api/expenses/:id",async (req, res) => {
    try {
        const id = req.params.id;

    
    
    const expense = await Expense.findOne({id})
    if (!expense) {
        res.status(404).json({ message: "Not Found" })
        return;
    }}
    
 catch (error ){
    res.status(500).send({ message: "Internal Server Error" });
}
});


app.post("/api/expenses", async (req, res) => {

    const { title, amount } = req.body;
    if (!title || !amount) {
        res.status(400).json({ message: "Please fill in all fields" })
    }
    const newExpense = new Expense({
        id: uudiv4(),
        title,
        amount
    })
    const savedExpendse = await newExpense.save()
    res.status(201).json(savedExpendse)

})
app.delete("/api/expenses/:id",async (req, res) => {
    const {id }= req.params
   try {
    const deletedExpense = await Expense.findOneAndDelete({id})
    if (!deletedExpense) {
        res.status(404).json({ message: "Not Found" })
        return
        }
        res.status(200).json({message:"Delete Successfully"});
   }catch (error){
    res.status(500).send({ message: "Internal Server Error" });
   }

});

app.put("/api/expenses/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, amount } = req.body;
        const updatedExpense = await Expense.findOneAndUpdate(
            { id }, 
            { $set: { title, amount } }, 
            { new: true }
        );
        if (!title && !amount) {
            res.status(400).json({ message: "No fields to update provided" });
            return;
        }
        if (!updatedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }

        res.status(200).json({ message: "Expense updated successfully", updatedExpense });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


app.post("/api/expenses", (req, res) => {
    Sconsole.log(req.body);
    res.end();

});

app.listen(3000, () => {
    console.log("Server is running");
});