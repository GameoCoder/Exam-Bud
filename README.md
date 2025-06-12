```
⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣴⣶⣶⣶⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀  
⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠀⠀⠈⠉⠛⠿⣷⣄⠀⠀⠀⠀⠀⠀  
⠀⠀⠀⢀⣴⣿⠟⠁   E X A M - B U D   ⠈⠻⣿⣦⡀⠀⠀  
⠀⠀⢀⣿⠟⠁⠀⠀⠉⠁      ⠈⠉⠀⠀⠈⠻⣿⣆⠀⠀  
⠀⠀⣼⠋⠀⢀⣤⣶⣾⣷⣶⣤⡀⠀⠀⠀⣴⣶⣾⣿⣿⡇⠀⠀  
⠀⢸⣿⠀⢰⣿⠟⠉⠀⠈⠙⣿⣿⠀⠀⠘⠿⠿⠿⠿⠛⠁⠀⠀  
⠀⠘⣿⣷⣌⡛⢷⣦⣀⣀⣴⠿⠋⠀⠀⠀⠀⣀⣀⣤⡄⠀⠀⠀  
⠀⠀⠈⠛⠿⠿⠿⠿⠿⠿⠋⠀⠀⠀⠀⠀⠀⠉⠛⠋⠀⠀⠀⠀
```

# 📘 Exam-Bud: Because finals are temporary, but Git commits are forever.

---

### 🧠 What's This?

Look man, I cloned this from some college GSoC-style thing. If you want the *corporate-sounding* explanation, go [**here**](https://github.com/bsoc-bitbyte/Exam-Bud/blob/main/README.md).
If you're still here, welcome to the **scuffed but soulful** edition.

---

### 🔩 How It Works (probably?)

> “It's not a bug, it's an undocumented feature.”

#### 💅 Frontend:

* ReactJS (because what else?)
* Vite (yes it's also here for...reasons)

#### 🔌 Backend:

* **ExpressJS** – Connects stuff
* **Multer** – Handles file uploads (hanging by a thread, soon to be cancelled 🪦)
* **PrismaDB** – Makes SQL look like JSON
* **Cloudinary** – For when you don’t want to store files like a normal person
* **Docker Daemon** – Not the backend, but always lurking like Batman in a corner

---

### 🧪 How to Run This Without Rage Quitting

> *Tested on Arch Linux because I need you to know I use Arch.*

#### Step 1: Summon the Daemon

```bash
sudo systemctl start docker.service
```

> *"If you see 'systemctl: command not found', i need you to know, I USE ARCH BTW"*<br>
> *“If you see ‘cannot connect to daemon’, summon it harder.”*

#### Step 2: Channel the Containers

```bash
sudo docker compose up --build -d
```

#### Bonus Level: Automate like a lazy genius 🧙‍♀️

```bash
touch run.sh
echo "sudo systemctl start docker.service; sudo docker compose up --build -d" > run.sh
chmod +x run.sh
./run.sh
```

---

### 🤡 Developer Notes

* Works best when you have no idea what you’re doing
* Ask ChatGPT when things break (which they will)
* Do not run on production unless you hate uptime
* Commit messages must include one meme reference or your PR is invalid

---

### 🛐 Final Thoughts

> "It works on my machine" — Ancient Dev Proverb
>
> “This repo is like a pizza. Messy, but satisfying.” — Me, just now

---

If this doesn't get you hired, I don’t know what will. 🐸👌


Number of issues fixed - above 99
0 - Ansh ki gaand
1 - frontend/src/components/LabList.jsx 
        previous - NO DELETE function, added a delete function