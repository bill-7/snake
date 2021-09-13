import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { '(document:keypress)': 'key($event)' }
})
export class AppComponent implements OnInit {
  readonly c = ['#181818', '#a68bf0', '#a6de6a', '#181818']
  score = 0
  grid = Array.from(Array(15), () => new Array(15).fill(0))
  run$!: Subscription
  snake = [{ x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }]
  dir = { x: 0, y: 1 }
  apple = {}

  ngOnInit() {
    this.run$ = interval(150).subscribe(_ => {
      this.snake.forEach(s => this.grid[s.y][s.x] = 3)
      this.move()
      this.snake.forEach(s => this.grid[s.y][s.x] = 1)
    })
    this.newApple()
  }

  move() {
    const equal = (a: any, b: any) => a.x == b.x && a.y == b.y
    const h = this.snake[0]
    const nh = { x: h.x + this.dir.x, y: h.y + this.dir.y }
    if (this.snake.some(s => equal(nh, s))) return
    this.snake.unshift(nh)
    equal(nh, this.apple) ? this.newApple() : this.snake.pop()
  }

  newApple() {
    const x = Math.floor(Math.random() * 15)
    const y = Math.floor(Math.random() * 15)
    if (this.grid[y][x] == 0) {
      this.apple = { x: x, y: y }
      this.grid[y][x] = 2
    } else this.newApple()
  }

  key(event: any) {
    if (!this.run$.closed) {
      switch (event.key) {
        case 'a': this.dir = { x: -1, y: 0 }; break
        case 'd': this.dir = { x: 1, y: 0 }; break
        case 'w': this.dir = { x: 0, y: -1 }; break
        case 's': this.dir = { x: 0, y: 1 }; break
      }
    }
  }
}