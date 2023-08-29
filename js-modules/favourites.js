import { GithubUser } from "./GithubUser.js"

class Favourites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search("maykbrito").then((user) => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favourites:")) || []
  }

  save() {
    localStorage.setItem("@github-favourites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)

      if (userExists) {
        throw new Error("User has already been registered!")
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error(`User haven't been found!`)
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    // higher-order functions (map, filter, find, reduce)
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavouritesView extends Favourites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`

      row.querySelector(".user img").alt = `${user.name} image`

      row.querySelector(".user a").href = `https://github.com/${user.login}`

      row.querySelector(".user p").textContent = user.name

      row.querySelector(".user span").textContent = user.login

      row.querySelector(".repositories").textContent = user.public_repos

      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Are you sure you want to delete this row?")

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td class="user">
        <img
          src="https://github.com/vinidelimaa.png"
          alt="Vinicius image"
        />
        <a href="https://github.com/vinidelimaa" target="_blank">
          <p>Vinicius Lima</p>
          <span>vinidelimaa</span>
        </a>
      </td>
      <td class="repositories">18</td>
      <td class="followers">41</td>
      <td>
        <button class="remove">&times;</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
