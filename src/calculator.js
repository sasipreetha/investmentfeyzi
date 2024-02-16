! function(t) {
    function e(a) {
        if (n[a]) return n[a].exports;
        var r = n[a] = {
            exports: {},
            id: a,
            loaded: !1
        };
        return t[a].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
    }
    var n = {};
    return e.m = t, e.c = n, e.p = "", e(0)
}([function(t, e, n) {
    "use strict";
    var a = n(1),
        r = n(11),
        i = n(12),
        s = n(13);
    $(document).ready(function() {
        s.initPattern();
        var t = new a.default(900, 400);
        window.addEventListener("stockCalculatorDataChange", function(e) {
            console.log("event stockCalculatorDataChange: " + e.detail.forceChartRender), t.refresh(e.detail.data, e.detail.forceChartRender)
        });
        var e = new r.default;
        window.addEventListener("chartViewModelChanged", function(t) {
            e.refresh(t.detail.data)
        }), i.initPattern()
    })
}, function(t, e, n) {
    "use strict";
    var a = n(2),
        r = n(4),
        i = function() {
            function t(t, e) {
                var n = this;
                this.n = 3, this.precision = 0, this.refresh = function(t, e) {
                    void 0 !== n.rafId && window.cancelAnimationFrame(n.rafId), n.rafId = window.requestAnimationFrame(function() {
                        n.refreshInternal(t, e), $("#chart-container").toggleClass("chart-container")
                    })
                }, this.showChart = function(t) {
                    n.lastRenderTime = new Date;
                    var e = n.svg.append("g").attr("transform", "translate(" + n.margin.left + "," + n.margin.top + ")").attr("id", "graph"),
                        a = d3.range(n.dauer).map(String);
                    n.werteMax = Number(d3.max(t, function(t) {
                        return d3.max(t, function(t) {
                            return t[1]
                        })
                    })), n.x = d3.scaleBand().domain(a).rangeRound([0, n.width]).paddingInner(.5).paddingOuter(0), n.y = d3.scaleLinear().domain([0, n.werteMax]).range([n.height, 0]);
                    var r = e.selectAll(".series").data(t).enter().append("g").attr("fill", function(t, e) {
                            return n.color(e)
                        }),
                        i = r.selectAll("rect").data(function(t) {
                            return t
                        }).enter().append("rect").attr("x", function(t, e) {
                            return n.x(e)
                        }).attr("y", function(t, e) {
                            var a = n.y(e).toFixed(n.precision);
                            return a
                        }).attr("width", n.x.bandwidth()).attr("height", 0),
                        s = n.dauer < 25 ? 10 : 5;
                    i.transition().delay(function(t, e) {
                        return e * s
                    }).attr("y", function(t) {
                        var e = n.y(t[1]).toFixed(n.precision);
                        return e
                    }).attr("height", function(t) {
                        var e = (n.y(t[0]) - n.y(t[1])).toFixed(n.precision);
                        return e
                    });
                    var u = d3.axisBottom(n.x).tickValues(n.getLabel(0, n.dauer, n.getStepForYears(n.dauer), !0)).tickFormat(function(t, e) {
                            return 0 === t ? "0" : t + " "
                        }),
                        o = n.werteMax < 170 ? 1 : 0,
                        l = d3.axisLeft(n.y).tickValues(n.getLabel(0, n.werteMax, n.getYSteps(n.werteMax), !0)).tickFormat(function(t, e) {
                            if (0 === t) return "0";
                            var n = t < 1e4,
                                a = n ? t / 10 : t / 1e4,
                                r = (n ? a.toFixed(o) : a.toFixed(2)).replace(".", ",");
                            return r + (n ? " Tsd." : " Mio.")
                        });
                    e.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + n.height + ")").call(u), e.append("g").attr("class", "axis axis--y").call(l)
                }, this.getStepForYears = function(t) {
                    return t <= 21 ? 1 : t <= 41 ? 2 : 5
                }, this.getLabel = function(t, e, n, a) {
                    for (var r = new Array, i = 0, s = t; s < e; s++)(s % n === 0 || a && s === e - 1) && (r[i] = "" + s, i++);
                    return r
                }, this.getYSteps = function(t) {
                    var e = Math.floor(t / 12);
                    return e
                }, this.updateViewModel = function(t, e) {
                    n.viewModel = new r.InvestmentCalculationViewModel(t, e), n.dispatchViewModelChangedEvent()
                }, this.convertToInvestmentCalculationInput = function(t) {
                    void 0 === t && (t = void 0);
                    var e = new r.InvestmentCalculationInput;
                    return t ? (e.einmalig = t["one-time-payment"], e.regelmaessig = t["regular-payment"], e.dauerInJahren = +t["investment-duration"], e.jaehrlicheWertentwicklungInProzent = t["investment-growth"], e.ausgabeaufschlagInProzent = t["issue-surcharge"], e.jaehrlicheInflationInProzent = t["inflation-rate"], e.turnus = t["payment-period"]) : (e.einmalig = n.einmal, e.regelmaessig = n.regelm, e.dauerInJahren = n.dauer - 1, e.jaehrlicheWertentwicklungInProzent = n.wertentw, e.ausgabeaufschlagInProzent = n.aufschlag, e.jaehrlicheInflationInProzent = n.inflation, e.turnus = n.turnus), e
                }, this.calculateAndUpdateViewModel = function() {
                    var t = new a.default,
                        e = n.convertToInvestmentCalculationInput(),
                        i = t.calculate(e),
                        s = new r.OutputTotalData;
                    s.angespartGesamt = i.angespartGesamt, s.wertzuwachsGesamt = i.wertzuwachsGesamt, s.angespartGesamtNachInflation = i.angespartGesamtNachInflation, n.updateViewModel(e, s);
                    var u = d3.range(n.n).map(function(t) {
                            return n.aggregateWerte(t, i)
                        }),
                        o = d3.stack().keys(n.range);
                    return o(d3.transpose(u))
                }, this.setInputValues = function(t) {
                    t && (n.einmal = t.einmalig, n.regelm = t.regelmaessig, n.dauer = t.dauerInJahren + 1, n.wertentw = t.jaehrlicheWertentwicklungInProzent, n.aufschlag = t.ausgabeaufschlagInProzent, n.inflation = t.jaehrlicheInflationInProzent, n.turnus = t.turnus)
                }, this.toDecimal = function(t) {
                    return parseFloat(t.replace(".", "").replace(", ", "."))
                }, this.setOutputValues = function() {
                    n.viewModel && ($("#guthaben")[0].innerText = n.viewModel.guthaben, $("#wertzuwachs")[0].innerText = n.viewModel.wertzuwachs, $("#guthabeninfl")[0].innerText = n.viewModel.guthabenInfl, $("#guthabeninflPara")[0].style.visibility = 0 === n.inflation ? "hidden" : "visible", $("#inputval")[0].style.display = 0 !== n.regelm || 0 !== n.einmal ? "none" : "inline")
                }, this.aggregateWerte = function(t, e) {
                    return 0 === t ? e.einmaligWerte.map(function(t) {
                        return n.getHundertstelValue(t)
                    }) : 1 === t ? e.regelmaessigWerte.map(function(t) {
                        return n.getHundertstelValue(t)
                    }) : 2 === t ? e.wertzuwachsWerte.map(function(t) {
                        return n.getHundertstelValue(t)
                    }) : null
                }, this.removeChart = function() {
                    $("#graph").remove()
                }, this.isInputDataEqual = function(t, e) {
                    return t && e && t.ausgabeaufschlagInProzent === e.ausgabeaufschlagInProzent && t.dauerInJahren === e.dauerInJahren && t.einmalig === e.einmalig && t.jaehrlicheInflationInProzent === e.jaehrlicheInflationInProzent && t.jaehrlicheWertentwicklungInProzent === e.jaehrlicheWertentwicklungInProzent && t.regelmaessig === e.regelmaessig && t.turnus === e.turnus
                }, this.refreshInternal = function(t, e) {
                    void 0 === e && (e = !1);
                    var a = n.convertToInvestmentCalculationInput(t),
                        r = n.isInputDataEqual(a, n.convertToInvestmentCalculationInput());
                    r || (n.setInputValues(a), n.chartValues = n.calculateAndUpdateViewModel(), n.removeChart(), n.setOutputValues(), n.renderChart(e))
                }, this.renderChart = function(t) {
                    var e = n.chartValues;
                    void 0 !== n.timeoutchart && clearTimeout(n.timeoutchart);
                    var a = n.lastRenderTime ? (new Date).getTime() - n.lastRenderTime.getTime() : 0,
                        r = n.dauer < 25 ? 1 : 2,
                        i = (t ? 250 : 500) * r,
                        s = (a < i ? i - a : 0) + 100;
                    n.timeoutchart = setTimeout(function() {
                        n.showChart(e)
                    }, s)
                }, this.dispatchViewModelChangedEvent = function() {
                    var t, e = "chartViewModelChanged";
                    "function" == typeof CustomEvent ? t = new CustomEvent(e, {
                        detail: {
                            data: n.viewModel
                        }
                    }) : (t = document.createEvent("CustomEvent"), t.initCustomEvent(e, !0, !0, {
                        data: n.viewModel
                    })), window.dispatchEvent(t)
                }, this.debugOutput = function(t, e) {
                    void 0 === e && (e = void 0);
                    var n = new Date;
                    console.log("---------------------------------------"), console.log(t + ", d:" + n.toLocaleString("de-DE") + " _ms:" + n.getMilliseconds()), e && console.log(JSON.stringify(e)), console.log("---------------------------------------")
                }, this.chartHeight = e, this.chartWidth = t, this.range = d3.range(this.n).map(String);
                var i = ["#D2D0CD", "#6A625A", "#353353"];
                this.color = d3.scaleOrdinal().domain(this.range).range(i), this.margin = {
                    top: 10,
                    right: 30,
                    bottom: 30,
                    left: 80
                }, this.width = this.chartWidth - this.margin.left - this.margin.right, this.height = this.chartHeight - this.margin.top - this.margin.bottom, this.svg = d3.select("div#chart-container").attr("style", "padding-bottom: " + Math.ceil(100 * e / t) + "%").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 " + this.chartWidth.toString() + " " + this.chartHeight.toString()).classed("svg-content", !0)
            }
            return t.prototype.getHundertstelValue = function(t) {
                return Math.round(Number(t / 100))
            }, t
        }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = i
}, function(t, e, n) {
    "use strict";
    var a = n(3),
        r = function() {
            function t() {
                var t = this;
                this.meagCalculator = new a.default, this.calculate = function(e) {
                    var n = t.meagCalculator.calculate(e);
                    return n && e && e.jaehrlicheInflationInProzent && (n.inflationsfaktor = t.calculateInflationfactor(e)), n
                }
            }
            return t.prototype.calculateInflationfactor = function(t) {
                var e = t.jaehrlicheInflationInProzent / 100,
                    n = t.dauerInJahren;
                return 1 / Math.pow(1 + e, n)
            }, t
        }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = r
}, function(t, e, n) {
    "use strict";
    var a = n(4),
        r = function() {
            function t(t) {
                var e = this;
                this.getValue = function() {
                    return e.value
                }, this.value = t
            }
            return t
        }(),
        i = function() {
            function t(t) {
                this.einzahlungeinmalig = new r(t.einmalig || 0), this.einzahlungregelmaessig = new r(t.regelmaessig || 0), this.einzahlungregelmaessigsteigerung = new r(0), this.anlagedauer = new r(t.dauerInJahren || 0), this.ausgabeaufschlag = new r(t.ausgabeaufschlagInProzent || 0), this.wertentwicklung = new r(t.jaehrlicheWertentwicklungInProzent || 0), this.einzahlungregelmaessigturnus = new r(t.turnus || a.Turnus.Jaehrlich)
            }
            return t
        }(),
        s = function() {
            function t() {
                var t = this;
                this.setData = function(e, n) {
                    t.array = e
                }
            }
            return t
        }(),
        u = function() {
            function t() {
                this[0] = new s, this[1] = new s, this[2] = new s
            }
            return t
        }(),
        o = function() {
            function t() {
                this.series = new u
            }
            return t
        }(),
        l = function() {
            function t() {
                var t = this;
                this._updateUiElements = function(t) {}, this._checkConditionsForVisibleElements = function() {}, this.calculate = function(e) {
                    return e ? (t.elementObjects = new i(e), t.$chartVisual = new o, t.calculateResult(), t.createReturnObject()) : null
                }, this.createReturnObject = function() {
                    for (var e = t.$chartVisual.series[2].array, n = t.$chartVisual.series[1].array, r = t.$chartVisual.series[0].array, i = new a.InvestmentCalculationOutput, s = 0; s < e.length; ++s) {
                        var u = new a.JahrData;
                        u.einmalig = e[s], u.regelmaessig = n[s], u.wertzuwachs = r[s], i.jahresdaten[s] = u
                    }
                    return i
                }, this.calculateResult = function() {
                    var e, n, a, r, i, s, u = t.elementObjects.einzahlungeinmalig.getValue(),
                        o = t.elementObjects.einzahlungregelmaessig.getValue(),
                        l = t.elementObjects.einzahlungregelmaessigsteigerung.getValue(),
                        c = t.elementObjects.anlagedauer.getValue(),
                        h = t.elementObjects.ausgabeaufschlag.getValue(),
                        d = t.elementObjects.wertentwicklung.getValue(),
                        f = t.elementObjects.einzahlungregelmaessigturnus.getValue(),
                        p = o,
                        g = 0,
                        m = u * (100 / (100 + h)),
                        v = o * (100 / (100 + h)),
                        w = 0;
                    0 != d && (w = Math.pow(1 + d / 100, 1 / 12));
                    var b = 0,
                        y = p,
                        I = 0;
                    l > 0 && (y = v), i = w - 1, a = v * w, 0 === o && (f = 12);
                    for (var C = [], M = [], E = [], V = 0; V <= c; V++) {
                        if (w = Math.pow(1 + d / 100, 1 / f), i = w - 1, l > 0 && V > 1) {
                            if (b += y * l / 100, l > 0 ? 1 === V ? y = b + y : y += y * l / 100 : y = p + b, d > 0) n = g * Math.pow(w, 1 * f), a = y * w;
                            else {
                                var x = Math.pow(1, 1 / f);
                                n = 1 * g, a = y * Math.pow(1, 1 / f)
                            }
                            r = Math.pow(w, 1 * f) - 1, I += b
                        } else {
                            if (1 === f) n = 1 === V && 0 != V ? d > 0 ? m * (1 + d / 100) : 1 * m : d > 0 ? g * (1 + d / 100) : 1 * g, r = Math.pow(w, 1 * f) - 1;
                            else {
                                if (d > 0) n = m * Math.pow(w, V * f);
                                else {
                                    var x = Math.pow(1, 1 / f);
                                    n = 0 === h && 0 === l ? 1 === V && 0 != V ? m * Math.pow(x, V * f) : g * Math.pow(x, V * f) : m * Math.pow(x, V * f)
                                }
                                r = Math.pow(w, V * f) - 1
                            }
                            w = Math.pow(1 + d / 100, 1 / f), a = 0 === v ? o * w : d > 0 ? v * w : v * Math.pow(1, 1 / f)
                        }
                        0 != d ? (g = n + a * r / i, s = g - V * f * v - m - I * f) : (g = 1 === f ? d > 0 ? u + (V + 1) * (f * a) : n + a : d > 0 ? n + V * (f * a) : h > 0 && 0 === l ? n + a * (V * f) : n + a * (1 * f), s = 0), (s < 0 || 0 == V) && (s = 0), C[V] = s, h > 0 ? E[V] = m : E[V] = u, 0 === V ? (M[V] = 0, h > 0 && (E[V] = m)) : 0 === o ? M[V] = o : h > 0 ? M[V] = g - s - m : M[V] = g - s - u
                    }
                    e = g, t.$chartVisual.series[0].setData(C, !0), t.$chartVisual.series[1].setData(M, !0), t.$chartVisual.series[2].setData(E, !0), t._updateUiElements(e), t._checkConditionsForVisibleElements()
                }, this.calculateXXX = function(t) {
                    if (!t) return null;
                    var e, n, r, i, s, u, o = t.einmalig || 0,
                        l = t.regelmaessig || 0,
                        c = 0,
                        h = t.dauerInJahren || 0,
                        d = t.ausgabeaufschlagInProzent || 0,
                        f = t.jaehrlicheWertentwicklungInProzent || 0,
                        p = t.turnus || a.Turnus.Jaehrlich,
                        g = l,
                        m = 0,
                        v = o * (100 / (100 + d)),
                        w = l - l * d / 100,
                        b = 0;
                    0 != f && (b = Math.pow(1 + f / 100, 1 / 12));
                    var y = 0,
                        I = g,
                        C = 0;
                    c > 0 && (I = w), s = b - 1, r = w * b, 0 === l && (p = 12);
                    for (var M = [], E = [], V = [], x = 0; x <= h; x++) {
                        if (b = Math.pow(1 + f / 100, 1 / p), s = b - 1, c > 0 && x > 1) {
                            if (y += I * c / 100, c > 0 ? 1 === x ? I = y + I : I += I * c / 100 : I = g + y, f > 0) n = m * Math.pow(b, 1 * p), r = I * b;
                            else {
                                var P = Math.pow(1, 1 / p);
                                n = 1 * m, r = I * Math.pow(1, 1 / p)
                            }
                            i = Math.pow(b, 1 * p) - 1, C += y
                        } else {
                            if (1 === p) n = 1 === x && 0 != x ? f > 0 ? v * (1 + f / 100) : 1 * v : f > 0 ? m * (1 + f / 100) : 1 * m, i = Math.pow(b, 1 * p) - 1;
                            else {
                                if (f > 0) n = v * Math.pow(b, x * p);
                                else {
                                    var P = Math.pow(1, 1 / p);
                                    n = 0 === d && 0 === c ? 1 === x && 0 != x ? v * Math.pow(P, x * p) : m * Math.pow(P, x * p) : v * Math.pow(P, x * p)
                                }
                                i = Math.pow(b, x * p) - 1
                            }
                            b = Math.pow(1 + f / 100, 1 / p), r = 0 === w ? l * b : f > 0 ? w * b : w * Math.pow(1, 1 / p)
                        }
                        0 != f ? (m = n + r * i / s, u = m - x * p * w - v - C * p) : (m = 1 === p ? f > 0 ? o + (x + 1) * (p * r) : n + r : f > 0 ? n + x * (p * r) : n + r * (1 * p), u = 0), (u < 0 || 0 == x) && (u = 0), M[x] = u, d > 0 ? V[x] = v : V[x] = o, 0 === x ? (E[x] = 0, d > 0 && (V[x] = v)) : 0 === l ? E[x] = l : d > 0 ? E[x] = m - u - v : E[x] = m - u - o
                    }
                    e = m;
                    for (var j = new a.InvestmentCalculationOutput, D = 0; D < V.length; ++D) {
                        var S = new a.JahrData;
                        S.einmalig = V[D], S.regelmaessig = E[D], S.wertzuwachs = M[D], j.jahresdaten[D] = S
                    }
                    return j
                }
            }
            return t
        }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = l
}, function(t, e, n) {
    "use strict";
    var a = n(5);
    e.InvestmentCalculationInput = a.default;
    var r = n(6);
    e.InvestmentCalculationOutput = r.default;
    var i = n(7);
    e.JahrData = i.default;
    var s = n(8);
    e.Turnus = s.default;
    var u = n(9);
    e.InvestmentCalculationViewModel = u.default;
    var o = n(10);
    e.OutputTotalData = o.default
}, function(t, e) {
    "use strict";
    var n = function() {
        function t() {}
        return t
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    var n = function() {
        function t() {
            this.jahresdaten = []
        }
        return Object.defineProperty(t.prototype, "angespartGesamt", {
            get: function() {
                return this.getPropertyOfLastSafe(function(t) {
                    return t.gesamt
                })
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(t.prototype, "angespartGesamtNachInflation", {
            get: function() {
                return this.angespartGesamt * (this.inflationsfaktor || 1)
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(t.prototype, "wertzuwachsGesamt", {
            get: function() {
                return this.getPropertyOfLastSafe(function(t) {
                    return t.wertzuwachs
                })
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(t.prototype, "wertzuwachsWerte", {
            get: function() {
                return this.getValuesSafe(function(t) {
                    return t.wertzuwachs
                })
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(t.prototype, "regelmaessigWerte", {
            get: function() {
                return this.getValuesSafe(function(t) {
                    return t.regelmaessig
                })
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(t.prototype, "einmaligWerte", {
            get: function() {
                return this.getValuesSafe(function(t) {
                    return t.einmalig
                })
            },
            enumerable: !0,
            configurable: !0
        }), t.prototype.getPropertyOfLastSafe = function(t) {
            var e = this.jahresdaten.length ? this.jahresdaten[this.jahresdaten.length - 1] : null;
            return e ? t(e) : null
        }, t.prototype.getValuesSafe = function(t) {
            return this.jahresdaten ? this.jahresdaten.map(t) : null
        }, t
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    var n = function() {
        function t() {}
        return Object.defineProperty(t.prototype, "gesamt", {
            get: function() {
                return this.wertzuwachs + this.regelmaessig + this.einmalig
            },
            enumerable: !0,
            configurable: !0
        }), t
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    ! function(t) {
        t[t.None = 0] = "None", t[t.Jaehrlich = 1] = "Jaehrlich", t[t.Halbjaehrlich = 2] = "Halbjaehrlich", t[t.Vierteljaehrlich = 4] = "Vierteljaehrlich", t[t.Monatlich = 12] = "Monatlich"
    }(e.Turnus || (e.Turnus = {}));
    var n = e.Turnus;
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    var n = function() {
        function t(e, n) {
            if (e) {
                this.einmal = t.formatAsCurrency(e.einmalig), this.regelm = t.formatAsCurrency(e.regelmaessig), this.turnus = t.formatTurnus(e.turnus + "");
                var a = e.dauerInJahren + " ";
                this.dauer = "1" === a ? a + "Jahr" : a + "Jahre";
                var r = " %";
                this.wertentw = t.format(e.jaehrlicheWertentwicklungInProzent) + r, this.aufschlag = t.format(e.ausgabeaufschlagInProzent) + r, this.inflation = t.format(e.jaehrlicheInflationInProzent) + r, n && (this.guthaben = t.formatAsCurrency(n.angespartGesamt), this.wertzuwachs = t.formatAsCurrency(n.wertzuwachsGesamt), this.guthabenInfl = t.formatAsCurrency(n.angespartGesamtNachInflation), this.isGuthabenInflVisible = !(0 === e.jaehrlicheInflationInProzent))
            }
        }
        return t.formatAsCurrency = function(t) {
            var e = {
                style: "currency",
                currency: "EUR"
            };
            return t.toLocaleString("de-DE", e)
        }, t.formatAsPercent = function(t) {
            var e = {
                style: "percent"
            };
            return t.toLocaleString("de-DE", e)
        }, t.format = function(t) {
            return t.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }, t.formatTurnus = function(t) {
            switch (t) {
                case "0":
                    return "";
                case "12":
                    return "monatlich";
                case "4":
                    return "vierteljährlich";
                case "2":
                    return "halbjährlich";
                case "1":
                    return "jährlich";
                default:
                    return ""
            }
        }, t
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    var n = function() {
        function t() {}
        return t
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    var n = function() {
        function t() {
            var e = this;
            this.closeTemplate = function() {
                var t = $(".xxx-root");
                t.removeClass("print-template")
            }, this.openTemplate = function() {
                var n = $(".xxx-root");
                n.addClass("print-template"), t.printDate(), e.print()
            }, this.print = function() {
                void 0 !== e.timeout && (console.log("timeout print removed"), clearTimeout(e.timeout));
                var t = e.lastRefreshTime ? (new Date).getTime() - e.lastRefreshTime.getTime() : 0,
                    n = t < 1e3 ? 1e3 - t + 100 : 10;
                e.timeout = setTimeout(function() {
                    window.print()
                }, n)
            }, this.refresh = function(n) {
                e.lastRefreshTime = new Date;
                var a = n;
                $("#print_einmal").html(a.einmal), $("#print_regelm").html(a.regelm), $("#print_wertentw").html(a.wertentw), $("#print_dauer").html(a.dauer), $("#print_aufschlag").html(a.aufschlag), $("#print_inflation").html(a.inflation), $("#print_turnus").html(a.turnus), $("#print_guthaben").html(a.guthaben), $("#print_wertzuwachs").html(a.wertzuwachs), $("#print_guthabenInfl").html(a.guthabenInfl), a.isGuthabenInflVisible ? $(".xxx-content-box-container__print").addClass("xxx-showGuthabenInfl") : $(".xxx-content-box-container__print").removeClass("xxx-showGuthabenInfl"), t.printDate()
            };
            var n = $(".close-print-template-button")[0],
                a = $(".open-print-template-button")[0];
            n.addEventListener("mousedown", function(t) {
                return e.closeTemplate()
            }), a.addEventListener("mousedown", function(t) {
                return e.openTemplate()
            })
        }
        return t.printDate = function() {
            var t = new Date,
                e = t.toLocaleString("de-DE");
            $("#print_date").html(e)
        }, t
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.default = n
}, function(t, e) {
    "use strict";
    var n = function() {
        function t(t) {
            var e = this;
            this.sliders = t.querySelectorAll("[data-role=slider-input]"), this.additionalData = t.querySelectorAll("[data-role=additional-data]"), this.forceChartRender = !0, [].forEach.call(this.sliders, function(t) {
                t.addEventListener("sliderInputUpdate", function(t) {
                    e.forceChartRender = t.detail.forceChartRender, e.collectData(), e.dispatchUpdateEvent()
                })
            }), [].forEach.call(this.additionalData, function(t) {
                "radio" === t.getAttribute("type") && t.addEventListener("click", function() {
                    e.forceChartRender = !0, e.collectData(), e.dispatchUpdateEvent()
                })
            }), this.collectData(), this.dispatchUpdateEvent()
        }
        return t.prototype.collectData = function() {
            var t = [];
            [].forEach.call(this.sliders, function(e) {
                var n = e.querySelector("[data-role=slider-input-value]");
                t[n.getAttribute("name")] = parseFloat(n.value)
            }), [].forEach.call(this.additionalData, function(e) {
                "radio" === e.getAttribute("type") && e.checked === !0 && (t[e.getAttribute("name")] = e.value)
            }), this.data = t
        }, t.prototype.dispatchUpdateEvent = function() {
            var t;
            "function" == typeof CustomEvent ? t = new CustomEvent("stockCalculatorDataChange", {
                detail: {
                    data: this.data,
                    forceChartRender: this.forceChartRender
                }
            }) : (t = document.createEvent("CustomEvent"), t.initCustomEvent("stockCalculatorDataChange", !0, !0, {
                data: this.data,
                forceChartRender: this.forceChartRender
            })), this.forceChartRender = !1, window.dispatchEvent(t)
        }, t
    }();
    e.initPattern = function() {
        var t = document.querySelectorAll("[data-role=stock-calculator]");
        [].forEach.call(t, function(t) {
            return new n(t)
        })
    }
}, function(t, e, n) {
    "use strict";
    var a = n(14),
        r = function() {
            function t(t) {
                var e = this;
                this.calculateAndSetSliderValue = function() {
                    e.slider.setSliderValue((+e.hiddenInput.value - e.min) / (e.max - e.min) * 100)
                }, this.setHiddenValue = function() {
                    e.hiddenInput.value = e.getCleanValue(e.textinput.value).toString()
                }, this.handleValidationResult = function() {
                    e.allInputsAreValid() ? $("#chart").show() : $("#chart").hide()
                }, this.einzahlungValid = function() {
                    var t = 0 !== $("#inp_regelm").val() || 0 !== $("#inp_einmal").val();
                    return $("#inputval")[0].style.display = t ? "none" : "inline", t
                }, this.allInputsAreValid = function() {
                    return 0 === $("body div.xxx-slider-input:not(.xxx-slider-input--valid)").length && e.einzahlungValid()
                }, this.rootEl = t, this.step = parseFloat(t.getAttribute("data-step")), this.hasDecPlace = "true" === t.getAttribute("data-hasdecimalplace"), this.textinput = t.querySelector(".xxx-textfield__input"), this.max = parseInt(this.textinput.getAttribute("max"), 10), this.min = parseInt(this.textinput.getAttribute("min"), 10), this.slider = new a.Slider(t.querySelector(".xxx-slider"), t.id), this.hiddenInput = t.querySelector("[data-role=slider-input-value]"), this.setHiddenValue(), this.textinput.addEventListener("keyup", function(t) {
                    return e.handleKeyUp()
                }), this.textinput.addEventListener("blur", function(t) {
                    return e.handleBlur()
                }), this.slider.updateCallback = function(t, n) {
                    return e.handleSliderUpdate(t, n)
                }, this.calculateAndSetSliderValue()
            }
            return t.prototype.getCleanValue = function(t) {
                var e = t.trim();
                return "" === e ? 0 : this.hasDecPlace ? parseFloat(e.split(".").join("").split(",").join(".")) : parseFloat(e.split(".").join("").split(",")[0])
            }, t.prototype.handleKeyUp = function() {
                if (this.validateInput(this.textinput.value)) {
                    this.setHiddenValue(), this.inputTimeout && clearTimeout(this.inputTimeout);
                    var t = this;
                    this.inputTimeout = setTimeout(function() {
                        t.calculateAndSetSliderValue(), t.forceChartRender = !0, t.dispatchUpdateEvent()
                    }, 600)
                }
            }, t.prototype.handleBlur = function() {
                this.validateInput(this.textinput.value) ? (this.rootEl.classList.add("xxx-slider-input--valid"), this.setTextInputValue(this.hiddenInput.value)) : this.rootEl.classList.remove("xxx-slider-input--valid"), this.handleValidationResult()
            }, t.prototype.validateInput = function(t) {
                var e = this.getCleanValue(t),
                    n = !0;
                return isNaN(e) ? n = !1 : (e > this.max || this.min > e) && (n = !1), n
            }, t.prototype.handleSliderUpdate = function(t, e) {
                var n = this.textinput.value;
                this.hiddenInput.value = (Math.ceil(((this.max - this.min) * t / 100 + this.min) / this.step) * this.step).toString(), 0 === t ? this.setTextInputValue(this.min) : this.setTextInputValue(this.hiddenInput.value), this.rootEl.classList.add("xxx-slider-input--valid"), this.forceChartRender = e;
                var a = this.textinput.value,
                    r = a !== n || e;
                r && this.dispatchUpdateEvent(), this.handleValidationResult()
            }, t.prototype.setTextInputValue = function(t) {
                "text" === this.textinput.getAttribute("type") ? this.textinput.value = this.formatCurrencyString(parseFloat(t)) : this.textinput.value = parseFloat(t).toLocaleString(), this.hasDecPlace || (this.textinput.value = this.textinput.value.split(",")[0])
            }, t.prototype.dispatchUpdateEvent = function() {
                var t;
                "function" == typeof CustomEvent ? t = new CustomEvent("sliderInputUpdate", {
                    detail: {
                        value: this.hiddenInput.value,
                        forceChartRender: this.forceChartRender
                    }
                }) : (t = document.createEvent("CustomEvent"), t.initCustomEvent("sliderInputUpdate", !0, !0, {
                    value: this.hiddenInput.value,
                    forceChartRender: this.forceChartRender
                })), this.forceChartRender = !1, this.rootEl.dispatchEvent(t)
            }, t.prototype.formatCurrencyString = function(t) {
                var e = 2,
                    n = 3,
                    a = ".",
                    r = ",",
                    i = "\\d(?=(\\d{" + (n || 3) + "})+" + (e > 0 ? "\\D" : "$") + ")",
                    s = t.toFixed(Math.max(0, ~~e));
                return (r ? s.replace(".", r) : s).replace(new RegExp(i, "g"), "$&" + (a || ","))
            }, t.prototype.debugOutput = function(t) {
                var e = new Date;
                console.log(t + ", d:" + e.toLocaleString("de-DE") + " _ms:" + e.getMilliseconds())
            }, t
        }();
    e.initPattern = function() {
        var t = document.querySelectorAll("[data-role=slider-input]");
        [].forEach.call(t, function(t) {
            return new r(t)
        })
    }
}, function(t, e) {
    "use strict";
    var n = function() {
        function t(t, e) {
            var n = this;
            void 0 === e && (e = void 0), this.startX = null, this.debugId = void 0, this.updateCallback = function(t, e) {}, this.dragHandleFn = function(t) {
                t.preventDefault(), t.stopPropagation(), n.handleKnobDrag(t)
            }, this.dragEndHandleFn = function(t) {
                t.preventDefault(), t.stopPropagation(), n.handleKnobMouseUp(t)
            }, this.calculateSliderPosition = function(t) {
                var e = t.offsetX || (t.touches ? t.touches[0].clientX : 0);
                return e / n.$slider.offsetWidth * 100
            }, this.updateSliderPosition = function(t) {
                n.value = Math.max(Math.min(t, 100), 0), n.$knob.style.left = n.value + "%", n.$bar.style.left = n.value - 100 + "%"
            }, this.$slider = t, this.debugId = e, this.$knob = t.querySelector('[data-role="slider-knob"]'), this.$bar = t.querySelector('[data-role="slider-bar"]'), this.activeDragClassName = this.$slider.className + "--drag-active", this.$slider.addEventListener("touchstart", function(t) {
                return n.handleKnobMouseDown(t)
            }), this.$slider.addEventListener("mousedown", function(t) {
                return n.handleKnobMouseDown(t)
            }), this.setSliderPosition(0)
        }
        return t.prototype.handleKnobMouseDown = function(t) {
            console.log("SLIDER handleKnobMouseDown: " + this.debugId), t.target === this.$slider && this.setSliderPosition(this.calculateSliderPosition(t)), this.startX = t.clientX || t.touches[0].clientX, this.offsetLeft = this.$knob.offsetLeft, this.$slider.classList.add(this.activeDragClassName), window.addEventListener("mousemove", this.dragHandleFn), window.addEventListener("mouseup", this.dragEndHandleFn), window.addEventListener("touchmove", this.dragHandleFn), window.addEventListener("touchend", this.dragEndHandleFn)
        }, t.prototype.handleKnobMouseUp = function(t) {
            this.startX = null, window.removeEventListener("mouseup", this.dragEndHandleFn), window.removeEventListener("mousemove", this.dragHandleFn), window.removeEventListener("touchmove", this.dragHandleFn), window.removeEventListener("touchend", this.dragEndHandleFn), this.$slider.classList.remove(this.activeDragClassName), this.updateCallback(this.value, !0)
        }, t.prototype.handleKnobDrag = function(t) {
            var e = t.clientX || (t.touches ? t.touches[0].clientX : 0);
            if (null !== this.startX) {
                var n = this.offsetLeft / this.$slider.offsetWidth - (this.startX - e) / this.$slider.offsetWidth;
                this.setSliderPosition(100 * n)
            }
        }, t.prototype.setSliderValue = function(t) {
            this.updateSliderPosition(t)
        }, t.prototype.setSliderPosition = function(t) {
            this.updateSliderPosition(t), this.updateCallback(this.value, !1)
        }, t
    }();
    e.Slider = n;
    var a = function() {
        var t = document.querySelectorAll("[data-role=slider]");
        [].forEach.call(t, function(t) {
            return new n(t)
        })
    };
    e.initPattern = a
}]);