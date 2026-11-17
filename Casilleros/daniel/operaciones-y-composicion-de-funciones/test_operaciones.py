import contextlib
import io
import unittest
from pathlib import Path
from html.parser import HTMLParser
import sympy as sp
from operaciones import of


def salida(*args, **kwargs):
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        of(*args, **kwargs)
    return buffer.getvalue()


class OperacionesTests(unittest.TestCase):
    def test_bloque_copiable_identico_al_archivo(self):
        class Bloque(HTMLParser):
            dentro = False
            texto = ""

            def handle_starttag(self, tag, attrs):
                if tag == "code" and dict(attrs).get("id") == "python-source":
                    self.dentro = True

            def handle_endtag(self, tag):
                if tag == "code":
                    self.dentro = False

            def handle_data(self, data):
                if self.dentro:
                    self.texto += data

        carpeta = Path(__file__).parent
        bloque = Bloque()
        bloque.feed((carpeta / "index.html").read_text(encoding="utf-8"))
        self.assertEqual(bloque.texto, (carpeta / "operaciones.py").read_text(encoding="utf-8"))

    def test_seis_operaciones_y_siete_variables(self):
        respuestas = {"s": "4", "r": "-1", "m": r"\frac{15}{4}",
                      "d": r"\frac{3}{5}", "fg": r"\frac{7}{2}", "gf": r"\frac{9}{2}"}
        for nombre in "p v u t x y z".split():
            variable = sp.Symbol(nombre)
            for op, resultado in respuestas.items():
                with self.subTest(variable=nombre, op=op):
                    texto = salida(variable + 1, 2 * variable + sp.Rational(3, 2), op, "1/2")
                    self.assertTrue(texto.endswith(" = " + resultado + r" \]" + "\n"))
                    self.assertEqual(len(texto.splitlines()), 4)
                    self.assertIn(f"Al evaluar ${nombre} = \\frac{{1}}{{2}}$ obtenemos", texto)

    def test_formato_sin_evaluar(self):
        self.assertEqual(salida("p+1", "2*p", "gf"),
            "Para las funciones\n"
            "\\[ f = p + 1 \\]\n"
            "\\[ g = 2 p \\]\n"
            "La operación composición g después de f es\n"
            "\\[ g\\left(f\\left(p\\right)\\right) = 2 \\left(p + 1\\right) \\]\n"
            "Simplificando\n"
            "\\[ g\\left(f\\left(p\\right)\\right) = 2 p + 2 \\]\n")

    def test_formato_evaluacion_fraccion(self):
        self.assertEqual(salida("p+1", "2*p", "fg", sp.Rational(1, 2)),
            "Para la función\n"
            "\\[ f\\left(g\\left(p\\right)\\right) = 2 p + 1 \\]\n"
            "Al evaluar $p = \\frac{1}{2}$ obtenemos\n"
            "\\[ f\\left(g\\left(\\frac{1}{2}\\right)\\right) = 2 \\]\n")

    def test_cero_activa_solo_formato_evaluacion(self):
        texto = salida("v+1", "2*v", "gf", 0)
        self.assertEqual(len(texto.splitlines()), 4)
        self.assertIn("$v = 0$", texto)
        self.assertNotIn("Simplificando", texto)
        self.assertNotIn(r"\[ f =", texto)
        self.assertTrue(texto.endswith(" = 2 \\]\n"))

    def test_no_anuncia_simplificacion_sin_cambio(self):
        for op in ("fg", "m", "d"):
            self.assertNotIn("Simplificando", salida("t+1", "2*t", op))
        self.assertIn("Simplificando", salida("t+1", "2*t", "s"))
        self.assertIn("Simplificando", salida("t+1", "2*t", "r"))

    def test_original_aritmetico_y_composicion_no_se_pierden(self):
        self.assertIn(r"\left(z + 1\right)-\left(2 z\right)", salida("z+1", "2*z", "r"))
        texto = salida("t+1", "t+1", "fg")
        self.assertIn(r"\left(t + 1\right) + 1", texto)
        self.assertIn("Simplificando", texto)
        self.assertIn(r"= t + 2 \]", texto)
        self.assertIn(r"\left(u + 1\right)^{2}", salida("u**2", "u+1", "fg"))

    def test_fracciones_texto_y_expresion_son_exactas(self):
        u = sp.Symbol("u")
        texto = salida("u/2+1/3", "u+1/2", "s", "1/2")
        self.assertTrue(texto.endswith(" = \\frac{19}{12} \\]\n"))
        self.assertEqual(texto, salida(u/2+sp.Rational(1, 3), u+sp.Rational(1, 2), "s", sp.Rational(1, 2)))
        self.assertNotIn("0.5", texto)

    def test_simbolo_con_supuestos_y_entrada_mixta(self):
        t = sp.Symbol("t", real=True)
        texto = salida(t+1, "2*t", "gf", "1/2")
        self.assertTrue(texto.endswith(" = 3 \\]\n"))

    def test_invertir_resta_y_division(self):
        self.assertTrue(salida("2*y", "y+1", "r", 2).endswith(" = 1 \\]\n"))
        self.assertTrue(salida("2*y", "y+1", "d", 2).endswith(" = \\frac{4}{3} \\]\n"))

    def test_constante_y_funciones_elementales(self):
        self.assertTrue(salida("3", "2*x", "fg", 0).endswith(" = 3 \\]\n"))
        self.assertTrue(salida("sin(t)", "t+1", "fg", -1).endswith(" = 0 \\]\n"))

    def test_entradas_ambiguas_invalidas_y_polos(self):
        for args in [("x", "y", "s"), ("2", "3", "s"), ("t", "t", "otro"),
                     ("t", "0", "d"), ("t+1", "2*t", "d", 0),
                     ("t**2-1", "t-1", "d", 1), ("1/t", "t+1", "fg", -1),
                     ("t", "t", "s", "1/0"), ("t", "t", "s", "q")]:
            with self.subTest(args=args):
                with self.assertRaises(ValueError):
                    salida(*args)


if __name__ == "__main__":
    unittest.main()
