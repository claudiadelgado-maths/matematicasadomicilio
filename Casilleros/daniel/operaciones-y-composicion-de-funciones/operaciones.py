import sympy as sp

# Símbolos y claves para llamar a of sin comillas.
x, y, z, p, v, u, t = sp.symbols("x y z p v u t")
s, r, m, d, fg, gf = "s", "r", "m", "d", "fg", "gf"
none = None  # No evaluar.


def of(f, g, operacion, evaluar=None):
    """Imprime LaTeX literal. Usa expresiones propias de una misma variable."""
    nombres = {
        "s": "suma", "r": "resta", "m": "multiplicación",
        "d": "división", "fg": "composición f después de g",
        "gf": "composición g después de f",
    }
    if operacion not in nombres:
        raise ValueError("Usa s, r, m, d, fg o gf.")

    # Reutiliza los símbolos de las expresiones al leer entradas de texto.
    locales = {}
    for funcion in (f, g):
        if isinstance(funcion, sp.Expr):
            for simbolo in funcion.free_symbols:
                if simbolo.name in locales and locales[simbolo.name] != simbolo:
                    raise ValueError("Usa el mismo símbolo en ambas funciones.")
                locales[simbolo.name] = simbolo

    def leer(funcion):
        expresion = sp.sympify(
            funcion, locals=locales, rational=True, evaluate=False
        )
        if not isinstance(expresion, sp.Expr):
            raise ValueError("Cada función debe ser una expresión de SymPy.")
        return expresion

    f, g = leer(f), leer(g)
    variables = f.free_symbols | g.free_symbols
    if len(variables) != 1:
        raise ValueError("Debe haber una sola variable común; no se puede inferir entre varias o ninguna.")
    variable = next(iter(variables))

    def sustituir(expresion, valor):
        # .subs() puede operar antes de imprimir; esta copia conserva el árbol.
        if expresion == variable:
            return valor
        if not expresion.has(variable):
            return expresion
        argumentos = [sustituir(a, valor) for a in expresion.args]
        return expresion.func(*argumentos, evaluate=False)

    F, G = sp.latex(f), sp.latex(g)
    if operacion == "s":
        original = sp.Add(f, g, evaluate=False)
        original_tex = rf"\left({F}\right)+\left({G}\right)"
    elif operacion == "r":
        original = sp.Add(f, sp.Mul(-1, g, evaluate=False), evaluate=False)
        original_tex = rf"\left({F}\right)-\left({G}\right)"
    elif operacion == "m":
        original = sp.Mul(f, g, evaluate=False)
        original_tex = rf"\left({F}\right)\cdot\left({G}\right)"
    elif operacion == "d":
        if sp.simplify(g) == 0:
            raise ValueError("La función del denominador no puede ser cero.")
        original = sp.Mul(f, sp.Pow(g, -1, evaluate=False), evaluate=False)
        original_tex = rf"\frac{{{F}}}{{{G}}}"
    else:
        exterior, interior = (f, g) if operacion == "fg" else (g, f)
        original = sustituir(exterior, interior)
        # Los paréntesis muestran exactamente qué se coloca dentro.
        dentro = rf"\left({sp.latex(interior)}\right)"
        original_tex = sp.latex(exterior, symbol_names={variable: dentro})

    transformar = sp.expand if operacion == "m" else sp.simplify
    simplificada = transformar(original)
    simple_tex = sp.latex(simplificada)
    cambia = sp.latex(original) != simple_tex

    def etiqueta(argumento):
        if operacion == "fg":
            return rf"f\left(g\left({argumento}\right)\right)"
        if operacion == "gf":
            return rf"g\left(f\left({argumento}\right)\right)"
        signo = {"s": "+", "r": "-", "m": r"\cdot ", "d": "/"}[operacion]
        return rf"\left(f{signo}g\right)\left({argumento}\right)"

    def ecuacion(izquierda, derecha):
        print(r"\[ " + izquierda + " = " + derecha + r" \]")

    if evaluar is None:
        print("Para las funciones")
        ecuacion("f", F)
        ecuacion("g", G)
        print(f"La operación {nombres[operacion]} es")
        ecuacion(etiqueta(sp.latex(variable)), original_tex)
        if cambia:
            print("Simplificando")
            ecuacion(etiqueta(sp.latex(variable)), simple_tex)
    else:
        numero = sp.sympify(evaluar, rational=True)
        if not isinstance(numero, sp.Expr) or not numero.is_number or numero.is_finite is not True:
            raise ValueError("El valor de evaluación debe ser un número finito.")

        def comprobar(expresion, valor):
            calculo = sustituir(expresion, valor).doit()
            if calculo.has(sp.zoo, sp.nan, sp.oo, -sp.oo):
                raise ValueError("La operación original no está definida en ese valor.")
            return calculo

        # Comprueba las entradas originales antes de evaluar la simplificada.
        if operacion == "fg":
            comprobar(f, comprobar(g, numero))
        elif operacion == "gf":
            comprobar(g, comprobar(f, numero))
        else:
            comprobar(f, numero)
            valor_g = comprobar(g, numero)
            if operacion == "d" and sp.simplify(valor_g) == 0:
                raise ValueError("El denominador vale cero en ese número.")

        resultado = transformar(simplificada.subs(variable, numero))
        print("Para la función")
        ecuacion(etiqueta(sp.latex(variable)), simple_tex)
        print(f"Al evaluar ${sp.latex(variable)} = {sp.latex(numero)}$ obtenemos")
        ecuacion(etiqueta(sp.latex(numero)), sp.latex(resultado))


if __name__ == "__main__":
    of(x + 1, 2*x, s, none)
    of(p + 1, 2*p, fg, evaluar=sp.Rational(1, 2))
