var pJS = function(tag_id, params) {
    var canvas_el = document.querySelector('#' + tag_id + ' > .particles-js-canvas-el')
    this.pJS = {
        canvas: { el: canvas_el, w: canvas_el.offsetWidth, h: canvas_el.offsetHeight },
        particles: {
            number: { value: 400, density: { enable: !0, value_area: 800 } },
            color: { value: '#fff' },
            shape: { type: 'circle', stroke: { width: 0, color: '#ff0000' }, polygon: { nb_sides: 5 }, image: { src: '', width: 100, height: 100 } },
            opacity: { value: 1, random: !1, anim: { enable: !1, speed: 2, opacity_min: 0, sync: !1 } },
            size: { value: 20, random: !1, anim: { enable: !1, speed: 20, size_min: 0, sync: !1 } },
            line_linked: { enable: !0, distance: 100, color: '#fff', opacity: 1, width: 1 },
            move: { enable: !0, speed: 2, direction: 'none', random: !1, straight: !1, out_mode: 'out', bounce: !1, attract: { enable: !1, rotateX: 3e3, rotateY: 3e3 } },
            array: [],
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: !0, mode: 'grab' }, onclick: { enable: !0, mode: 'push' }, resize: !0 },
            modes: {
                grab: { distance: 100, line_linked: { opacity: 1 } },
                bubble: { distance: 200, size: 80, duration: 0.4 },
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
            },
            mouse: {},
        },
        retina_detect: !1,
        fn: { interact: {}, modes: {}, vendors: {} },
        tmp: {},
    }
    var pJS = this.pJS
    params && Object.deepExtend(pJS, params),
        (pJS.tmp.obj = {
            size_value: pJS.particles.size.value,
            size_anim_speed: pJS.particles.size.anim.speed,
            move_speed: pJS.particles.move.speed,
            line_linked_distance: pJS.particles.line_linked.distance,
            line_linked_width: pJS.particles.line_linked.width,
            mode_grab_distance: pJS.interactivity.modes.grab.distance,
            mode_bubble_distance: pJS.interactivity.modes.bubble.distance,
            mode_bubble_size: pJS.interactivity.modes.bubble.size,
            mode_repulse_distance: pJS.interactivity.modes.repulse.distance,
        }),
        (pJS.fn.retinaInit = function() {
            pJS.retina_detect && 1 < window.devicePixelRatio ? ((pJS.canvas.pxratio = window.devicePixelRatio), (pJS.tmp.retina = !0)) : ((pJS.canvas.pxratio = 1), (pJS.tmp.retina = !1)),
                (pJS.canvas.w = pJS.canvas.el.offsetWidth * pJS.canvas.pxratio),
                (pJS.canvas.h = pJS.canvas.el.offsetHeight * pJS.canvas.pxratio),
                (pJS.particles.size.value = pJS.tmp.obj.size_value * pJS.canvas.pxratio),
                (pJS.particles.size.anim.speed = pJS.tmp.obj.size_anim_speed * pJS.canvas.pxratio),
                (pJS.particles.move.speed = pJS.tmp.obj.move_speed * pJS.canvas.pxratio),
                (pJS.particles.line_linked.distance = pJS.tmp.obj.line_linked_distance * pJS.canvas.pxratio),
                (pJS.interactivity.modes.grab.distance = pJS.tmp.obj.mode_grab_distance * pJS.canvas.pxratio),
                (pJS.interactivity.modes.bubble.distance = pJS.tmp.obj.mode_bubble_distance * pJS.canvas.pxratio),
                (pJS.particles.line_linked.width = pJS.tmp.obj.line_linked_width * pJS.canvas.pxratio),
                (pJS.interactivity.modes.bubble.size = pJS.tmp.obj.mode_bubble_size * pJS.canvas.pxratio),
                (pJS.interactivity.modes.repulse.distance = pJS.tmp.obj.mode_repulse_distance * pJS.canvas.pxratio)
        }),
        (pJS.fn.canvasInit = function() {
            pJS.canvas.ctx = pJS.canvas.el.getContext('2d')
        }),
        (pJS.fn.canvasSize = function() {;
            (pJS.canvas.el.width = pJS.canvas.w),
            (pJS.canvas.el.height = pJS.canvas.h),
            pJS &&
                pJS.interactivity.events.resize &&
                window.addEventListener('resize', function() {;
                    (pJS.canvas.w = pJS.canvas.el.offsetWidth),
                    (pJS.canvas.h = pJS.canvas.el.offsetHeight),
                    pJS.tmp.retina && ((pJS.canvas.w *= pJS.canvas.pxratio), (pJS.canvas.h *= pJS.canvas.pxratio)),
                        (pJS.canvas.el.width = pJS.canvas.w),
                        (pJS.canvas.el.height = pJS.canvas.h),
                        pJS.particles.move.enable || (pJS.fn.particlesEmpty(), pJS.fn.particlesCreate(), pJS.fn.particlesDraw(), pJS.fn.vendors.densityAutoParticles()),
                        pJS.fn.vendors.densityAutoParticles()
                })
        }),
        (pJS.fn.canvasPaint = function() {
            pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h)
        }),
        (pJS.fn.canvasClear = function() {
            pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h)
        }),
        (pJS.fn.particle = function(shape_selected, opacity, position) {;
            (this.radius = (pJS.particles.size.random ? Math.random() : 1) * pJS.particles.size.value),
            pJS.particles.size.anim.enable && ((this.size_status = !1), (this.vs = pJS.particles.size.anim.speed / 100), pJS.particles.size.anim.sync || (this.vs = this.vs * Math.random())),
                (this.x = position ? position.x : Math.random() * pJS.canvas.w),
                (this.y = position ? position.y : Math.random() * pJS.canvas.h),
                this.x > pJS.canvas.w - 2 * this.radius ? (this.x = this.x - this.radius) : this.x < 2 * this.radius && (this.x = this.x + this.radius),
                this.y > pJS.canvas.h - 2 * this.radius ? (this.y = this.y - this.radius) : this.y < 2 * this.radius && (this.y = this.y + this.radius),
                pJS.particles.move.bounce && pJS.fn.vendors.checkOverlap(this, position),
                (this.color = {}),
                'object' == typeof shape_selected.value ?
                shape_selected.value instanceof Array ?
                ((sh = shape_selected.value[Math.floor(Math.random() * pJS.particles.color.value.length)]), (this.color.rgb = hexToRgb(sh))) :
                (null != shape_selected.value.r &&
                    null != shape_selected.value.g &&
                    null != shape_selected.value.b &&
                    (this.color.rgb = { r: shape_selected.value.r, g: shape_selected.value.g, b: shape_selected.value.b }),
                    null != shape_selected.value.h &&
                    null != shape_selected.value.s &&
                    null != shape_selected.value.l &&
                    (this.color.hsl = { h: shape_selected.value.h, s: shape_selected.value.s, l: shape_selected.value.l })) :
                'random' == shape_selected.value ?
                (this.color.rgb = { r: Math.floor(256 * Math.random()) + 0, g: Math.floor(256 * Math.random()) + 0, b: Math.floor(256 * Math.random()) + 0 }) :
                'string' == typeof shape_selected.value && ((this.color = shape_selected), (this.color.rgb = hexToRgb(this.color.value))),
                (this.opacity = (pJS.particles.opacity.random ? Math.random() : 1) * pJS.particles.opacity.value),
                pJS.particles.opacity.anim.enable && ((this.opacity_status = !1), (this.vo = pJS.particles.opacity.anim.speed / 100), pJS.particles.opacity.anim.sync || (this.vo = this.vo * Math.random()))
            var velbase = {}
            switch (pJS.particles.move.direction) {
                case 'top':
                    velbase = { x: 0, y: -1 }
                    break
                case 'top-right':
                    velbase = { x: 0.5, y: -0.5 }
                    break
                case 'right':
                    velbase = { x: 1, y: -0 }
                    break
                case 'bottom-right':
                    velbase = { x: 0.5, y: 0.5 }
                    break
                case 'bottom':
                    velbase = { x: 0, y: 1 }
                    break
                case 'bottom-left':
                    velbase = { x: -0.5, y: 1 }
                    break
                case 'left':
                    velbase = { x: -1, y: 0 }
                    break
                case 'top-left':
                    velbase = { x: -0.5, y: -0.5 }
                    break
                default:
                    velbase = { x: 0, y: 0 }
            }
            pJS.particles.move.straight ?
                ((this.vx = velbase.x), (this.vy = velbase.y), pJS.particles.move.random && ((this.vx = this.vx * Math.random()), (this.vy = this.vy * Math.random()))) :
                ((this.vx = velbase.x + Math.random() - 0.5), (this.vy = velbase.y + Math.random() - 0.5)),
                (this.vx_i = this.vx),
                (this.vy_i = this.vy)
            var sh = pJS.particles.shape.type;
            'object' == typeof sh ? sh instanceof Array && ((shape_selected = sh[Math.floor(Math.random() * sh.length)]), (this.shape = shape_selected)) : (this.shape = sh),
                'image' == this.shape &&
                ((sh = pJS.particles.shape),
                    (this.img = { src: sh.image.src, ratio: sh.image.width / sh.image.height }),
                    this.img.ratio || (this.img.ratio = 1),
                    'svg' == pJS.tmp.img_type && null != pJS.tmp.source_svg && (pJS.fn.vendors.createSvgImg(this), pJS.tmp.pushing && (this.img.loaded = !1)))
        }),
        (pJS.fn.particle.prototype.draw = function() {
            var radius,
                color_value,
                img_obj,
                p = this
            switch (
                ((radius = null != p.radius_bubble ? p.radius_bubble : p.radius),
                    (color_value = null != p.opacity_bubble ? p.opacity_bubble : p.opacity),
                    (color_value = p.color.rgb ?
                        'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + color_value + ')' :
                        'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + color_value + ')'),
                    (pJS.canvas.ctx.fillStyle = color_value),
                    pJS.canvas.ctx.beginPath(),
                    p.shape)
            ) {
                case 'circle':
                    pJS.canvas.ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI, !1)
                    break
                case 'edge':
                    pJS.canvas.ctx.rect(p.x - radius, p.y - radius, 2 * radius, 2 * radius)
                    break
                case 'triangle':
                    pJS.fn.vendors.drawShape(pJS.canvas.ctx, p.x - radius, p.y + radius / 1.66, 2 * radius, 3, 2)
                    break
                case 'polygon':
                    pJS.fn.vendors.drawShape(
                        pJS.canvas.ctx,
                        p.x - radius / (pJS.particles.shape.polygon.nb_sides / 3.5),
                        p.y - radius / 0.76,
                        (2.66 * radius) / (pJS.particles.shape.polygon.nb_sides / 3),
                        pJS.particles.shape.polygon.nb_sides,
                        1
                    )
                    break
                case 'star':
                    pJS.fn.vendors.drawShape(
                        pJS.canvas.ctx,
                        p.x - (2 * radius) / (pJS.particles.shape.polygon.nb_sides / 4),
                        p.y - radius / 1.52,
                        (2 * radius * 2.66) / (pJS.particles.shape.polygon.nb_sides / 3),
                        pJS.particles.shape.polygon.nb_sides,
                        2
                    )
                    break
                case 'image':
                    ;
                    (img_obj = 'svg' == pJS.tmp.img_type ? p.img.obj : pJS.tmp.img_obj) && pJS.canvas.ctx.drawImage(img_obj, p.x - radius, p.y - radius, 2 * radius, (2 * radius) / p.img.ratio)
            }
            pJS.canvas.ctx.closePath(),
                0 < pJS.particles.shape.stroke.width &&
                ((pJS.canvas.ctx.strokeStyle = pJS.particles.shape.stroke.color), (pJS.canvas.ctx.lineWidth = pJS.particles.shape.stroke.width), pJS.canvas.ctx.stroke()),
                pJS.canvas.ctx.fill()
        }),
        (pJS.fn.particlesCreate = function() {
            for (var i = 0; i < pJS.particles.number.value; i++) pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value))
        }),
        (pJS.fn.particlesUpdate = function() {
            for (var i = 0; i < pJS.particles.array.length; i++) {
                var new_pos,
                    p = pJS.particles.array[i]
                if (
                    (pJS.particles.move.enable && ((new_pos = pJS.particles.move.speed / 2), (p.x += p.vx * new_pos), (p.y += p.vy * new_pos)),
                        pJS.particles.opacity.anim.enable &&
                        (1 == p.opacity_status ?
                            (p.opacity >= pJS.particles.opacity.value && (p.opacity_status = !1), (p.opacity += p.vo)) :
                            (p.opacity <= pJS.particles.opacity.anim.opacity_min && (p.opacity_status = !0), (p.opacity -= p.vo)),
                            p.opacity < 0 && (p.opacity = 0)),
                        pJS.particles.size.anim.enable &&
                        (1 == p.size_status ?
                            (p.radius >= pJS.particles.size.value && (p.size_status = !1), (p.radius += p.vs)) :
                            (p.radius <= pJS.particles.size.anim.size_min && (p.size_status = !0), (p.radius -= p.vs)),
                            p.radius < 0 && (p.radius = 0)),
                        (new_pos =
                            'bounce' == pJS.particles.move.out_mode ? { x_left: p.radius, x_right: pJS.canvas.w, y_top: p.radius, y_bottom: pJS.canvas.h } : { x_left: -p.radius, x_right: pJS.canvas.w + p.radius, y_top: -p.radius, y_bottom: pJS.canvas.h + p.radius }),
                        p.x - p.radius > pJS.canvas.w ? ((p.x = new_pos.x_left), (p.y = Math.random() * pJS.canvas.h)) : p.x + p.radius < 0 && ((p.x = new_pos.x_right), (p.y = Math.random() * pJS.canvas.h)),
                        p.y - p.radius > pJS.canvas.h ? ((p.y = new_pos.y_top), (p.x = Math.random() * pJS.canvas.w)) : p.y + p.radius < 0 && ((p.y = new_pos.y_bottom), (p.x = Math.random() * pJS.canvas.w)),
                        'bounce' === pJS.particles.move.out_mode &&
                        ((p.x + p.radius > pJS.canvas.w || p.x - p.radius < 0) && (p.vx = -p.vx), (p.y + p.radius > pJS.canvas.h || p.y - p.radius < 0) && (p.vy = -p.vy)),
                        isInArray('grab', pJS.interactivity.events.onhover.mode) && pJS.fn.modes.grabParticle(p),
                        (isInArray('bubble', pJS.interactivity.events.onhover.mode) || isInArray('bubble', pJS.interactivity.events.onclick.mode)) && pJS.fn.modes.bubbleParticle(p),
                        (isInArray('repulse', pJS.interactivity.events.onhover.mode) || isInArray('repulse', pJS.interactivity.events.onclick.mode)) && pJS.fn.modes.repulseParticle(p),
                        pJS.particles.line_linked.enable || pJS.particles.move.attract.enable)
                )
                    for (var j = i + 1; j < pJS.particles.array.length; j++) {
                        var p2 = pJS.particles.array[j]
                        pJS.particles.line_linked.enable && pJS.fn.interact.linkParticles(p, p2),
                            pJS.particles.move.attract.enable && pJS.fn.interact.attractParticles(p, p2),
                            pJS.particles.move.bounce && pJS.fn.interact.bounceParticles(p, p2)
                    }
            }
        }),
        (pJS.fn.particlesDraw = function() {
            pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h), pJS.fn.particlesUpdate()
            for (var i = 0; i < pJS.particles.array.length; i++) pJS.particles.array[i].draw()
        }),
        (pJS.fn.particlesEmpty = function() {
            pJS.particles.array = []
        }),
        (pJS.fn.particlesRefresh = function() {
            cancelRequestAnimFrame(pJS.fn.checkAnimFrame),
                cancelRequestAnimFrame(pJS.fn.drawAnimFrame),
                (pJS.tmp.source_svg = void 0),
                (pJS.tmp.img_obj = void 0),
                (pJS.tmp.count_svg = 0),
                pJS.fn.particlesEmpty(),
                pJS.fn.canvasClear(),
                pJS.fn.vendors.start()
        }),
        (pJS.fn.interact.linkParticles = function(p1, p2) {
            var color_line = p1.x - p2.x,
                opacity_line = p1.y - p2.y,
                color_line;
            (color_line = Math.sqrt(color_line * color_line + opacity_line * opacity_line)) <= pJS.particles.line_linked.distance &&
                0 < (opacity_line = pJS.particles.line_linked.opacity - color_line / (1 / pJS.particles.line_linked.opacity) / pJS.particles.line_linked.distance) &&
                ((color_line = pJS.particles.line_linked.color_rgb_line),
                    (pJS.canvas.ctx.strokeStyle = 'rgba(' + color_line.r + ',' + color_line.g + ',' + color_line.b + ',' + opacity_line + ')'),
                    (pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width),
                    pJS.canvas.ctx.beginPath(),
                    pJS.canvas.ctx.moveTo(p1.x, p1.y),
                    pJS.canvas.ctx.lineTo(p2.x, p2.y),
                    pJS.canvas.ctx.stroke(),
                    pJS.canvas.ctx.closePath())
        }),
        (pJS.fn.interact.attractParticles = function(p1, p2) {
            var ax = p1.x - p2.x,
                ay = p1.y - p2.y
            Math.sqrt(ax * ax + ay * ay) <= pJS.particles.line_linked.distance &&
                ((ax /= 1e3 * pJS.particles.move.attract.rotateX), (ay /= 1e3 * pJS.particles.move.attract.rotateY), (p1.vx -= ax), (p1.vy -= ay), (p2.vx += ax), (p2.vy += ay))
        }),
        (pJS.fn.interact.bounceParticles = function(p1, p2) {
            var dx = p1.x - p2.x,
                dy = p1.y - p2.y
            Math.sqrt(dx * dx + dy * dy) <= p1.radius + p2.radius && ((p1.vx = -p1.vx), (p1.vy = -p1.vy), (p2.vx = -p2.vx), (p2.vy = -p2.vy))
        }),
        (pJS.fn.modes.pushParticles = function(nb, pos) {
            pJS.tmp.pushing = !0
            for (var i = 0; i < nb; i++)
                pJS.particles.array.push(
                    new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value, { x: pos ? pos.pos_x : Math.random() * pJS.canvas.w, y: pos ? pos.pos_y : Math.random() * pJS.canvas.h })
                ),
                i == nb - 1 && (pJS.particles.move.enable || pJS.fn.particlesDraw(), (pJS.tmp.pushing = !1))
        }),
        (pJS.fn.modes.removeParticles = function(nb) {
            pJS.particles.array.splice(0, nb), pJS.particles.move.enable || pJS.fn.particlesDraw()
        }),
        (pJS.fn.modes.bubbleParticle = function(p) {
            function init() {;
                (p.opacity_bubble = p.opacity), (p.radius_bubble = p.radius)
            }

            function process(bubble_param, particles_param, p_obj_bubble, p_obj, id) {
                var value
                bubble_param != particles_param &&
                    (pJS.tmp.bubble_duration_end ?
                        null != p_obj_bubble &&
                        ((value = bubble_param + (bubble_param - (p_obj - (time_spent * (p_obj - bubble_param)) / pJS.interactivity.modes.bubble.duration))),
                            'size' == id && (p.radius_bubble = value),
                            'opacity' == id && (p.opacity_bubble = value)) :
                        dist_mouse <= pJS.interactivity.modes.bubble.distance ?
                        (null != p_obj_bubble ? p_obj_bubble : p_obj) != bubble_param &&
                        ((value = p_obj - (time_spent * (p_obj - bubble_param)) / pJS.interactivity.modes.bubble.duration),
                            'size' == id && (p.radius_bubble = value),
                            'opacity' == id && (p.opacity_bubble = value)) :
                        ('size' == id && (p.radius_bubble = void 0), 'opacity' == id && (p.opacity_bubble = void 0)))
            }
            var ratio, dif, size, opacity, dx_mouse, dy_mouse, dist_mouse, time_spent
            pJS.interactivity.events.onhover.enable && isInArray('bubble', pJS.interactivity.events.onhover.mode) ?
                ((dx_mouse = p.x - pJS.interactivity.mouse.pos_x),
                    (dy_mouse = p.y - pJS.interactivity.mouse.pos_y),
                    (ratio = 1 - (dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse)) / pJS.interactivity.modes.bubble.distance),
                    dist_mouse <= pJS.interactivity.modes.bubble.distance ?
                    0 <= ratio &&
                    'mousemove' == pJS.interactivity.status &&
                    (pJS.interactivity.modes.bubble.size != pJS.particles.size.value &&
                        (pJS.interactivity.modes.bubble.size > pJS.particles.size.value ?
                            0 <= (size = p.radius + pJS.interactivity.modes.bubble.size * ratio) && (p.radius_bubble = size) :
                            ((dif = p.radius - pJS.interactivity.modes.bubble.size), (size = p.radius - dif * ratio), (p.radius_bubble = 0 < size ? size : 0))),
                        pJS.interactivity.modes.bubble.opacity != pJS.particles.opacity.value &&
                        (pJS.interactivity.modes.bubble.opacity > pJS.particles.opacity.value ?
                            (opacity = pJS.interactivity.modes.bubble.opacity * ratio) > p.opacity && opacity <= pJS.interactivity.modes.bubble.opacity && (p.opacity_bubble = opacity) :
                            (opacity = p.opacity - (pJS.particles.opacity.value - pJS.interactivity.modes.bubble.opacity) * ratio) < p.opacity &&
                            opacity >= pJS.interactivity.modes.bubble.opacity &&
                            (p.opacity_bubble = opacity))) :
                    init(),
                    'mouseleave' == pJS.interactivity.status && init()) :
                pJS.interactivity.events.onclick.enable &&
                isInArray('bubble', pJS.interactivity.events.onclick.mode) &&
                (pJS.tmp.bubble_clicking &&
                    ((dx_mouse = p.x - pJS.interactivity.mouse.click_pos_x),
                        (dy_mouse = p.y - pJS.interactivity.mouse.click_pos_y),
                        (dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse)),
                        (time_spent = (new Date().getTime() - pJS.interactivity.mouse.click_time) / 1e3) > pJS.interactivity.modes.bubble.duration && (pJS.tmp.bubble_duration_end = !0),
                        time_spent > 2 * pJS.interactivity.modes.bubble.duration && ((pJS.tmp.bubble_clicking = !1), (pJS.tmp.bubble_duration_end = !1))),
                    pJS.tmp.bubble_clicking &&
                    (process(pJS.interactivity.modes.bubble.size, pJS.particles.size.value, p.radius_bubble, p.radius, 'size'),
                        process(pJS.interactivity.modes.bubble.opacity, pJS.particles.opacity.value, p.opacity_bubble, p.opacity, 'opacity')))
        }),
        (pJS.fn.modes.repulseParticle = function(p) {
            var normVec_x, normVec_y, repulseRadius, dx, dy, d, force, pos_x, pos_y
            pJS.interactivity.events.onhover.enable && isInArray('repulse', pJS.interactivity.events.onhover.mode) && 'mousemove' == pJS.interactivity.status ?
                ((normVec_y = p.x - pJS.interactivity.mouse.pos_x),
                    (repulseRadius = p.y - pJS.interactivity.mouse.pos_y),
                    (normVec_x = normVec_y / (d = Math.sqrt(normVec_y * normVec_y + repulseRadius * repulseRadius))),
                    (normVec_y = repulseRadius / d),
                    (d = clamp((1 / (repulseRadius = pJS.interactivity.modes.repulse.distance)) * (-1 * Math.pow(d / repulseRadius, 2) + 1) * repulseRadius * 100, 0, 50)),
                    (d = { x: p.x + normVec_x * d, y: p.y + normVec_y * d }),
                    'bounce' == pJS.particles.move.out_mode ?
                    (0 < d.x - p.radius && d.x + p.radius < pJS.canvas.w && (p.x = d.x), 0 < d.y - p.radius && d.y + p.radius < pJS.canvas.h && (p.y = d.y)) :
                    ((p.x = d.x), (p.y = d.y))) :
                pJS.interactivity.events.onclick.enable &&
                isInArray('repulse', pJS.interactivity.events.onclick.mode) &&
                (pJS.tmp.repulse_finish || (pJS.tmp.repulse_count++, pJS.tmp.repulse_count == pJS.particles.array.length && (pJS.tmp.repulse_finish = !0)),
                    pJS.tmp.repulse_clicking ?
                    ((repulseRadius = Math.pow(pJS.interactivity.modes.repulse.distance / 6, 3)),
                        (dx = pJS.interactivity.mouse.click_pos_x - p.x),
                        (dy = pJS.interactivity.mouse.click_pos_y - p.y),
                        (force = (-repulseRadius / (d = dx * dx + dy * dy)) * 1),
                        d <= repulseRadius &&
                        ((pos_y = Math.atan2(dy, dx)),
                            (p.vx = force * Math.cos(pos_y)),
                            (p.vy = force * Math.sin(pos_y)),
                            'bounce' == pJS.particles.move.out_mode &&
                            ((pos_x = p.x + p.vx),
                                (pos_y = p.y + p.vy),
                                (pos_x + p.radius > pJS.canvas.w || pos_x - p.radius < 0) && (p.vx = -p.vx),
                                (pos_y + p.radius > pJS.canvas.h || pos_y - p.radius < 0) && (p.vy = -p.vy)))) :
                    0 == pJS.tmp.repulse_clicking && ((p.vx = p.vx_i), (p.vy = p.vy_i)))
        }),
        (pJS.fn.modes.grabParticle = function(p) {
            var opacity_line, color_line
            pJS.interactivity.events.onhover.enable &&
                'mousemove' == pJS.interactivity.status &&
                ((color_line = p.x - pJS.interactivity.mouse.pos_x),
                    (opacity_line = p.y - pJS.interactivity.mouse.pos_y),
                    (color_line = Math.sqrt(color_line * color_line + opacity_line * opacity_line)) <= pJS.interactivity.modes.grab.distance &&
                    0 < (opacity_line = pJS.interactivity.modes.grab.line_linked.opacity - color_line / (1 / pJS.interactivity.modes.grab.line_linked.opacity) / pJS.interactivity.modes.grab.distance) &&
                    ((color_line = pJS.particles.line_linked.color_rgb_line),
                        (pJS.canvas.ctx.strokeStyle = 'rgba(' + color_line.r + ',' + color_line.g + ',' + color_line.b + ',' + opacity_line + ')'),
                        (pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width),
                        pJS.canvas.ctx.beginPath(),
                        pJS.canvas.ctx.moveTo(p.x, p.y),
                        pJS.canvas.ctx.lineTo(pJS.interactivity.mouse.pos_x, pJS.interactivity.mouse.pos_y),
                        pJS.canvas.ctx.stroke(),
                        pJS.canvas.ctx.closePath()))
        }),
        (pJS.fn.vendors.eventsListeners = function() {
            'window' == pJS.interactivity.detect_on ? (pJS.interactivity.el = window) : (pJS.interactivity.el = pJS.canvas.el),
                (pJS.interactivity.events.onhover.enable || pJS.interactivity.events.onclick.enable) &&
                (pJS.interactivity.el.addEventListener('mousemove', function(pos_y) {
                        var pos_x;
                        (pos_y = pJS.interactivity.el == window ? ((pos_x = pos_y.clientX), pos_y.clientY) : ((pos_x = pos_y.offsetX || pos_y.clientX), pos_y.offsetY || pos_y.clientY)),
                        (pJS.interactivity.mouse.pos_x = pos_x),
                        (pJS.interactivity.mouse.pos_y = pos_y),
                        pJS.tmp.retina && ((pJS.interactivity.mouse.pos_x *= pJS.canvas.pxratio), (pJS.interactivity.mouse.pos_y *= pJS.canvas.pxratio)),
                            (pJS.interactivity.status = 'mousemove')
                    }),
                    pJS.interactivity.el.addEventListener('mouseleave', function(e) {;
                        (pJS.interactivity.mouse.pos_x = null), (pJS.interactivity.mouse.pos_y = null), (pJS.interactivity.status = 'mouseleave')
                    })),
                pJS.interactivity.events.onclick.enable &&
                pJS.interactivity.el.addEventListener('click', function() {
                    if (
                        ((pJS.interactivity.mouse.click_pos_x = pJS.interactivity.mouse.pos_x),
                            (pJS.interactivity.mouse.click_pos_y = pJS.interactivity.mouse.pos_y),
                            (pJS.interactivity.mouse.click_time = new Date().getTime()),
                            pJS.interactivity.events.onclick.enable)
                    )
                        switch (pJS.interactivity.events.onclick.mode) {
                            case 'push':
                                pJS.particles.move.enable || 1 == pJS.interactivity.modes.push.particles_nb ?
                                    pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb, pJS.interactivity.mouse) :
                                    1 < pJS.interactivity.modes.push.particles_nb && pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb)
                                break
                            case 'remove':
                                pJS.fn.modes.removeParticles(pJS.interactivity.modes.remove.particles_nb)
                                break
                            case 'bubble':
                                pJS.tmp.bubble_clicking = !0
                                break
                            case 'repulse':
                                ;
                                (pJS.tmp.repulse_clicking = !0),
                                (pJS.tmp.repulse_count = 0),
                                (pJS.tmp.repulse_finish = !1),
                                setTimeout(function() {
                                    pJS.tmp.repulse_clicking = !1
                                }, 1e3 * pJS.interactivity.modes.repulse.duration)
                        }
                })
        }),
        (pJS.fn.vendors.densityAutoParticles = function() {
            var missing_particles
            pJS.particles.number.density.enable &&
                ((missing_particles = (pJS.canvas.el.width * pJS.canvas.el.height) / 1e3),
                    pJS.tmp.retina && (missing_particles /= 2 * pJS.canvas.pxratio),
                    (missing_particles = (missing_particles * pJS.particles.number.value) / pJS.particles.number.density.value_area),
                    (missing_particles = pJS.particles.array.length - missing_particles) < 0 ? pJS.fn.modes.pushParticles(Math.abs(missing_particles)) : pJS.fn.modes.removeParticles(missing_particles))
        }),
        (pJS.fn.vendors.checkOverlap = function(p1, position) {
            for (var i = 0; i < pJS.particles.array.length; i++) {
                var p2 = pJS.particles.array[i],
                    dx = p1.x - p2.x,
                    dy = p1.y - p2.y
                Math.sqrt(dx * dx + dy * dy) <= p1.radius + p2.radius &&
                    ((p1.x = position ? position.x : Math.random() * pJS.canvas.w), (p1.y = position ? position.y : Math.random() * pJS.canvas.h), pJS.fn.vendors.checkOverlap(p1))
            }
        }),
        (pJS.fn.vendors.createSvgImg = function(p) {
            var svg = pJS.tmp.source_svg.replace(/#([0-9A-F]{3,6})/gi, function(m, r, g, b) {
                    return p.color.rgb ?
                        'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + p.opacity + ')' :
                        'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + p.opacity + ')'
                }),
                svg = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
                DOMURL = window.URL || window.webkitURL || window,
                url = DOMURL.createObjectURL(svg),
                img = new Image()
            img.addEventListener('load', function() {;
                    (p.img.obj = img), (p.img.loaded = !0), DOMURL.revokeObjectURL(url), pJS.tmp.count_svg++
                }),
                (img.src = url)
        }),
        (pJS.fn.vendors.destroypJS = function() {
            cancelAnimationFrame(pJS.fn.drawAnimFrame), canvas_el.remove(), (pJSDom = null)
        }),
        (pJS.fn.vendors.drawShape = function(c, startX, startY, sideLength, sideCountNumerator, decimalSides) {
            var sideCount = sideCountNumerator * decimalSides,
                decimalSides = sideCountNumerator / decimalSides,
                interiorAngle = Math.PI - (Math.PI * ((180 * (decimalSides - 2)) / decimalSides)) / 180
            c.save(), c.beginPath(), c.translate(startX, startY), c.moveTo(0, 0)
            for (var i = 0; i < sideCount; i++) c.lineTo(sideLength, 0), c.translate(sideLength, 0), c.rotate(interiorAngle)
            c.fill(), c.restore()
        }),
        (pJS.fn.vendors.exportImg = function() {
            window.open(pJS.canvas.el.toDataURL('image/png'), '_blank')
        }),
        (pJS.fn.vendors.loadImg = function(type) {
            var xhr, img;
            (pJS.tmp.img_error = void 0),
            '' != pJS.particles.shape.image.src ?
                'svg' == type ?
                ((xhr = new XMLHttpRequest()).open('GET', pJS.particles.shape.image.src),
                    (xhr.onreadystatechange = function(data) {
                        4 == xhr.readyState &&
                            (200 == xhr.status ? ((pJS.tmp.source_svg = data.currentTarget.response), pJS.fn.vendors.checkBeforeDraw()) : (console.log('Error pJS - Image not found'), (pJS.tmp.img_error = !0)))
                    }),
                    xhr.send()) :
                ((img = new Image()).addEventListener('load', function() {;
                        (pJS.tmp.img_obj = img), pJS.fn.vendors.checkBeforeDraw()
                    }),
                    (img.src = pJS.particles.shape.image.src)) :
                (console.log('Error pJS - No image.src'), (pJS.tmp.img_error = !0))
        }),
        (pJS.fn.vendors.draw = function() {
            'image' == pJS.particles.shape.type ?
                'svg' == pJS.tmp.img_type ?
                pJS.tmp.count_svg >= pJS.particles.number.value ?
                (pJS.fn.particlesDraw(), pJS.particles.move.enable ? (pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw)) : cancelRequestAnimFrame(pJS.fn.drawAnimFrame)) :
                pJS.tmp.img_error || (pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw)) :
                null != pJS.tmp.img_obj ?
                (pJS.fn.particlesDraw(), pJS.particles.move.enable ? (pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw)) : cancelRequestAnimFrame(pJS.fn.drawAnimFrame)) :
                pJS.tmp.img_error || (pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw)) :
                (pJS.fn.particlesDraw(), pJS.particles.move.enable ? (pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw)) : cancelRequestAnimFrame(pJS.fn.drawAnimFrame))
        }),
        (pJS.fn.vendors.checkBeforeDraw = function() {
            'image' == pJS.particles.shape.type ?
                'svg' == pJS.tmp.img_type && null == pJS.tmp.source_svg ?
                (pJS.tmp.checkAnimFrame = requestAnimFrame(check)) :
                (cancelRequestAnimFrame(pJS.tmp.checkAnimFrame), pJS.tmp.img_error || (pJS.fn.vendors.init(), pJS.fn.vendors.draw())) :
                (pJS.fn.vendors.init(), pJS.fn.vendors.draw())
        }),
        (pJS.fn.vendors.init = function() {
            pJS.fn.retinaInit(),
                pJS.fn.canvasInit(),
                pJS.fn.canvasSize(),
                pJS.fn.canvasPaint(),
                pJS.fn.particlesCreate(),
                pJS.fn.vendors.densityAutoParticles(),
                (pJS.particles.line_linked.color_rgb_line = hexToRgb(pJS.particles.line_linked.color))
        }),
        (pJS.fn.vendors.start = function() {
            isInArray('image', pJS.particles.shape.type) ?
                ((pJS.tmp.img_type = pJS.particles.shape.image.src.substr(pJS.particles.shape.image.src.length - 3)), pJS.fn.vendors.loadImg(pJS.tmp.img_type)) :
                pJS.fn.vendors.checkBeforeDraw()
        }),
        pJS.fn.vendors.eventsListeners(),
        pJS.fn.vendors.start()
}

function hexToRgb(result) {
    return (
        (result = result.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
            return r + r + g + g + b + b
        })),
        (result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(result)) ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
    )
}

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max)
}

function isInArray(value, array) {
    return -1 < array.indexOf(value)
};
(Object.deepExtend = function(destination, source) {
    for (var property in source)
        source[property] && source[property].constructor && source[property].constructor === Object ?
        ((destination[property] = destination[property] || {}), arguments.callee(destination[property], source[property])) :
        (destination[property] = source[property])
    return destination
}),
(window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1e3 / 60)
    }),
(window.cancelRequestAnimFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout),
(window.pJSDom = []),
(window.particlesJS = function(tag_id, params) {
    'string' != typeof tag_id && ((params = tag_id), (tag_id = 'particles-js')), (tag_id = tag_id || 'particles-js')
    var pJS_tag = document.getElementById(tag_id),
        exist_canvas = pJS_tag.getElementsByClassName('particles-js-canvas-el')
    if (exist_canvas.length)
        for (; 0 < exist_canvas.length;) pJS_tag.removeChild(exist_canvas[0])
    var canvas_el = document.createElement('canvas');
    (canvas_el.className = 'particles-js-canvas-el'),
    (canvas_el.style.width = '100%'),
    (canvas_el.style.height = '100%'),
    null != document.getElementById(tag_id).appendChild(canvas_el) && pJSDom.push(new pJS(tag_id, params))
}),
(window.particlesJS.load = function(tag_id, path_config_json, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', path_config_json),
        (xhr.onreadystatechange = function(params) {
            4 == xhr.readyState &&
                (200 == xhr.status ?
                    ((params = JSON.parse(params.currentTarget.response)), window.particlesJS(tag_id, params), callback && callback()) :
                    (console.log('Error pJS - XMLHttpRequest status: ' + xhr.status), console.log('Error pJS - File config not found')))
        }),
        xhr.send()
}),
setTimeout(() => {
    particlesJS('particles-js', {
        particles: {
            number: { value: 600, density: { enable: !0, value_area: 800 } },
            color: { value: ['#0046f0', '#e09352', '#f50d00', '#ffffff', '#ffff00'] },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
            opacity: { value: 1, random: !0, anim: { enable: !0, speed: 1, opacity_min: 0, sync: !1 } },
            size: { value: 5, random: !0, anim: { enable: !1, speed: 1, size_min: 0.3, sync: !1 } },
            line_linked: { enable: !1, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: !0, speed: 1, direction: 'none', random: !0, straight: !1, out_mode: 'out', bounce: !1, attract: { enable: !1, rotateX: 600, rotateY: 600 } },
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: !1, mode: 'bubble' }, onclick: { enable: !1, mode: 'repulse' }, resize: !0 },
            modes: {
                grab: { distance: 400, line_linked: { opacity: 1 } },
                bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 1 },
                repulse: { distance: 400, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
            },
        },
        retina_detect: !0,
    })
}, 700)
//# sourceMappingURL=stars.min.js.map